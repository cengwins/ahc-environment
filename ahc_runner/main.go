package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"time"

	types "github.com/docker/docker/api/types"
	containertypes "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	mounttypes "github.com/docker/docker/api/types/mount"
	docker "github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	jsonmessage "github.com/docker/docker/pkg/jsonmessage"
	git "github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/google/uuid"
	cli "github.com/urfave/cli/v2"
	"gopkg.in/yaml.v3"
)

const AHC_FILENAME = ".ahc.yml"

type TopologyConfiguration struct {
	Name  string
	Nodes []string
	Links []string
}

type ExperimentRunConfiguration struct {
	Name          string
	Topology      string
	SamplingCount int `yaml:"sampling_count"`
}

type ExperimentConfiguration struct {
	Runs []ExperimentRunConfiguration
}

type AHCConfiguration struct {
	Image   string
	Command string
	Env     map[string]string

	Topologies []TopologyConfiguration
	Experiment ExperimentConfiguration
}

type RunnerResponse struct {
	Name string `json:"name"`
}

type RepositoryResponse struct {
	Id       int    `json:"id"`
	Slug     int    `json:"slug"`
	Name     string `json:"name"`
	Upstream string `json:"upstream"`
}

type ExperimentResponse struct {
	Id         int                `json:"id"`
	SequenceID int                `json:"sequence_id"`
	Commit     string             `json:"commit"`
	Repository RepositoryResponse `json:"repository"`
}

type SubmitRunnerJobRequestRun struct {
	StartedAt  string `json:"started_at"`
	FinishedAt string `json:"finished_at"`
	Logs       string `json:"logs"`
	ExitCode   int    `json:"exit_code"`
}

type SubmitRunnerJobRequest struct {
	ExperimentId int                         `json:"experiment_id"`
	Runs         []SubmitRunnerJobRequestRun `json:"runs"`
}

var serverUrl string
var serverSecret string
var containerBindPath string
var hostBindPath string

var dockerClient docker.APIClient

func clone(containerVolumePath string, url string, outStream io.Writer) error {
	repo, err := git.PlainClone(containerVolumePath, false, &git.CloneOptions{
		InsecureSkipTLS: true,
		Depth:           1,
		URL:             url,
		ReferenceName:   plumbing.NewBranchReferenceName("main"),
		SingleBranch:    true,
		Progress:        outStream,
	})
	if err != nil {
		return err
	}

	hash, err := repo.ResolveRevision(plumbing.Revision("main"))
	if err != nil {
		return err
	}

	fmt.Printf("Successfully checkout %s\n", hash)

	return nil
}

func printJsonStreamToScreen(wr io.Writer, rd io.ReadCloser) {
	defer rd.Close()

	jsonmessage.DisplayJSONMessagesStream(rd, wr, 0, false, nil)
}

func initDocker() error {
	var err error
	dockerClient, err = docker.NewClientWithOpts(docker.FromEnv)
	if err != nil {
		return err
	}

	return nil
}

func makeRequest(req *http.Request) (*http.Response, error) {
	client := http.Client{}
	req.Header = http.Header{
		"Authorization": []string{fmt.Sprintf("Basic %s", serverSecret)},
		"Content-Type":  []string{"application/json"},
	}

	res, err := client.Do(req)

	return res, err
}

func readConfig(containerVolumePath string) (AHCConfiguration, error) {
	buf, err := ioutil.ReadFile(path.Join(containerVolumePath, AHC_FILENAME))
	if err != nil {
		return AHCConfiguration{}, err
	}

	c := AHCConfiguration{}
	err = yaml.Unmarshal(buf, &c)
	if err != nil {
		return AHCConfiguration{}, err
	}

	return c, nil
}

func pullImage(image string, outStream io.Writer) error {
	ctx := context.Background()
	res, err := dockerClient.ImagePull(ctx, image, types.ImagePullOptions{})
	if err != nil {
		return err
	}

	printJsonStreamToScreen(outStream, res)

	return nil
}

func buildImage(contextPath string, outStream io.Writer) (string, error) {
	ctx := context.Background()
	tar, err := archive.TarWithOptions(contextPath, &archive.TarOptions{})
	if err != nil {
		return "", err
	}

	imageId := uuid.NewString()

	opts := types.ImageBuildOptions{
		Dockerfile: "Dockerfile",
		Tags:       []string{imageId},
		PullParent: true,
		NoCache:    true,
		Remove:     true,
	}
	res, err := dockerClient.ImageBuild(ctx, tar, opts)
	if err != nil {
		return "", err
	}

	printJsonStreamToScreen(outStream, res.Body)

	return imageId, nil
}

func runContainer(hostVolumePath string, image string, command string, env []string) (string, error) {
	ctx := context.Background()
	c, err := dockerClient.ContainerCreate(
		ctx,
		&containertypes.Config{
			Image:      image,
			Cmd:        []string{"/bin/sh", "-c", command},
			Env:        env,
			WorkingDir: "/app",
		},
		&containertypes.HostConfig{
			Mounts: []mounttypes.Mount{
				{
					Type:   mounttypes.TypeBind,
					Source: hostVolumePath,
					Target: "/app",
				},
				{
					Type:   mounttypes.TypeBind,
					Source: "/dev/bus/usb",
					Target: "/dev/bus/usb",
				},
			},
			Privileged: true,
		},
		nil,
		nil,
		"",
	)
	if err != nil {
		fmt.Printf("%s\n", err)
		return "", err
	}

	err = dockerClient.ContainerStart(ctx, c.ID, types.ContainerStartOptions{})
	if err != nil {
		fmt.Printf("%s\n", err)
		return "", err
	}

	reader, err := dockerClient.ContainerLogs(context.Background(), c.ID, types.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     true,
	})
	if err != nil {
		return "", err
	}
	defer reader.Close()

	content, _ := ioutil.ReadAll(reader)

	err = dockerClient.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{})
	if err != nil {
		return "", err
	}

	return string(content), nil
}

func runJob(upstream_url string) ([]SubmitRunnerJobRequestRun, error) {
	var resultBuffer bytes.Buffer

	result := make([]SubmitRunnerJobRequestRun, 0)

	volumeId := uuid.NewString()
	containerVolumePath := fmt.Sprintf("%s/%s", containerBindPath, volumeId)
	hostVolumePath := fmt.Sprintf("%s/%s", hostBindPath, volumeId)

	fmt.Printf("Using directory %s\n", containerVolumePath)

	err := clone(containerVolumePath, upstream_url, &resultBuffer)
	if err != nil {
		return result, err
	}

	config, err := readConfig(containerVolumePath)
	if err != nil {
		return result, err
	}

	containerImage := config.Image

	if containerImage == "." {
		containerImage, err = buildImage(containerVolumePath, &resultBuffer)
		if err != nil {
			return result, err
		}
	} else {
		err = pullImage(config.Image, &resultBuffer)
		if err != nil {
			return result, err
		}
	}

	env := make([]string, len(config.Env)+3)
	env[0] = fmt.Sprintf("AHC_TOKEN=%s", "DEFAULT_TOKEN")
	i := 1

	for k, s := range config.Env {
		env[i] = fmt.Sprintf("%s=%s", k, s)
		i += 1
	}

	ahc_run_name_env_index := i
	ahc_run_seq_env_index := i + 1

	if len(config.Experiment.Runs) == 0 {
		fmt.Printf("No run configuration found for experiment, exiting...\n")

		return result, err
	}

	totalRuns := 0
	for _, run := range config.Experiment.Runs {
		totalRuns += run.SamplingCount
	}

	result = make([]SubmitRunnerJobRequestRun, totalRuns)

	k := 0
	for _, run := range config.Experiment.Runs {
		fmt.Printf("Running for run %s with total sampling with %d\n", run.Name, run.SamplingCount)

		env[ahc_run_name_env_index] = fmt.Sprintf("AHC_RUN_NAME=%s", run.Name)

		for i := 0; i < run.SamplingCount; i++ {
			fmt.Printf("Running for run %s sampling id %d\n", run.Name, i)

			env[ahc_run_seq_env_index] = fmt.Sprintf("AHC_RUN_SEQ=%d", i)

			startTime := time.Now()
			logs, err := runContainer(hostVolumePath, containerImage, config.Command, env)
			if err != nil {
				return result, err
			}
			endTime := time.Now()

			result[k] = SubmitRunnerJobRequestRun{
				StartedAt:  startTime.Format("2006-01-02 15:04:05.000000"),
				FinishedAt: endTime.Format("2006-01-02 15:04:05.000000"),
				ExitCode:   0,
				Logs:       fmt.Sprintf("%s\n%s\n", resultBuffer.String(), logs),
			}
			k += 1
		}
	}

	return result, nil
}

func checkRunner() error {
	connect_path := fmt.Sprintf("http://%s/api/runner/", serverUrl)

	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return err
	}

	res, err := makeRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server, exiting...")
		return errors.New("Could not connect to server")
	}

	var data RunnerResponse
	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return err
	}

	fmt.Printf("Connected with runner %s\n", data.Name)

	return nil
}

func submitRunnerJobResult(experimentId int, result []SubmitRunnerJobRequestRun) error {
	data := SubmitRunnerJobRequest{
		ExperimentId: experimentId,
		Runs:         result,
	}
	body, err := json.Marshal(data)
	if err != nil {
		return err
	}

	connect_path := fmt.Sprintf("http://%s/api/runner/submit/", serverUrl)

	req, err := http.NewRequest("POST", connect_path, bytes.NewReader(body))
	if err != nil {
		return err
	}

	res, err := makeRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server, exiting...")
		return errors.New("Could not connect to server")
	}

	return nil
}

func checkForNewJob() error {
	connect_path := fmt.Sprintf("http://%s/api/runner/jobs/", serverUrl)

	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return err
	}

	res, err := makeRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 && res.StatusCode != 204 {
		fmt.Println("Could not connect to server, exiting...")
		return errors.New("Could not connect to server")
	}

	if res.StatusCode == 204 {
		fmt.Println("No new job found, skipping...")
		return nil
	}

	var data ExperimentResponse
	json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return err
	}

	fmt.Printf("Found job from repository %s from upstream %s commit %s\n", data.Repository.Name, data.Repository.Upstream, data.Commit)

	result, err := runJob(data.Repository.Upstream)
	if err != nil {
		return err
	}

	submitRunnerJobResult(data.Id, result)

	return nil
}

func startDaemon() {
	r := checkRunner()

	if r == nil {
		for range time.Tick(5 * time.Second) {
			r = checkForNewJob()

			if r != nil {
				break
			}
		}
	}
}

func main() {
	app := &cli.App{
		Name: "AHC Runner",
		Before: func(c *cli.Context) error {
			hostBindPath = os.Getenv("AHC_HOST_BIND_PATH")
			if hostBindPath == "" {
				hostBindPath = "/tmp/ahc-runner"
			}

			containerBindPath = os.Getenv("AHC_DATA_VOLUME")
			if containerBindPath == "" {
				containerBindPath = "/tmp/ahc-runner"
			}

			var err error

			err = initDocker()
			if err != nil {
				return err
			}

			return nil
		},
		After: func(c *cli.Context) error {
			ctx := context.Background()

			fmt.Printf("Cleaning leftovers\n")

			_, err := dockerClient.BuildCachePrune(ctx, types.BuildCachePruneOptions{All: true})
			if err != nil {
				return err
			}

			pruneFilters := filters.NewArgs()
			pruneFilters.Add("dangling", "false")
			_, err = dockerClient.ImagesPrune(ctx, pruneFilters)
			if err != nil {
				return err
			}
			return nil
		},
		Commands: []*cli.Command{
			{
				Name:  "start",
				Usage: "Start runner",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "url",
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					upstream_url := c.String("url")

					_, err := runJob(upstream_url)
					if err != nil {
						fmt.Printf("%s\n", err)
					}

					return err
				},
			},
			{
				Name:  "daemon",
				Usage: "Start daemon",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "url",
						Required: true,
					},
					&cli.StringFlag{
						Name:     "secret",
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					serverUrl = c.String("url")
					serverSecret = c.String("secret")

					fmt.Printf("Starting daemon for %s\n", serverUrl)

					startDaemon()

					return nil
				},
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
