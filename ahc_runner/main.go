package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"time"

	types "github.com/docker/docker/api/types"
	containertypes "github.com/docker/docker/api/types/container"
	mounttypes "github.com/docker/docker/api/types/mount"
	docker "github.com/docker/docker/client"
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
	SamplingCount int
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
	Name string
}

type RepositoryResponse struct {
	Id       int
	Slug     int
	Name     string
	Upstream string
}

type ExperimentResponse struct {
	Id          int
	Sequence_id int
	Commit      string
	Repository  RepositoryResponse
}

var volumeId string
var containerBindPath string
var hostBindPath string
var containerVolumePath string
var hostVolumePath string

var ahcConfiguration AHCConfiguration
var dockerClient docker.APIClient

func clone(url string) error {
	repo, err := git.PlainClone(containerVolumePath, false, &git.CloneOptions{
		InsecureSkipTLS: true,
		Depth:           1,
		URL:             url,
		ReferenceName:   plumbing.NewBranchReferenceName("main"),
		SingleBranch:    true,
		Progress:        os.Stdout,
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

func initDocker() error {
	var err error
	dockerClient, err = docker.NewClientWithOpts(docker.FromEnv)
	if err != nil {
		return err
	}

	return nil
}

func readConfig() (AHCConfiguration, error) {
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

func pullImage(image string) error {
	ctx := context.Background()
	_, err := dockerClient.ImagePull(ctx, image, types.ImagePullOptions{})
	if err != nil {
		return err
	}

	return nil
}

func runContainer(image string, command string, env []string) error {
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
		return err
	}

	err = dockerClient.ContainerStart(ctx, c.ID, types.ContainerStartOptions{})
	if err != nil {
		return err
	}

	reader, _ := dockerClient.ContainerLogs(context.Background(), c.ID, types.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     true,
	})
	defer reader.Close()
	content, _ := ioutil.ReadAll(reader)
	fmt.Print(string(content))

	err = dockerClient.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{})
	if err != nil {
		return err
	}

	return nil
}

func runJob(upstream_url string) error {
	volumeId = uuid.NewString()
	containerVolumePath = fmt.Sprintf("%s/%s", containerBindPath, volumeId)
	hostVolumePath = fmt.Sprintf("%s/%s", hostBindPath, volumeId)

	fmt.Printf("Using directory %s\n", containerVolumePath)

	clone(upstream_url)

	config, err := readConfig()
	if err != nil {
		return err
	}

	if config.Image != "." {
		err = pullImage(config.Image)
		if err != nil {
			return err
		}
	}

	// TODO: handle the case where config.Image == "."

	env := make([]string, len(config.Env)+3)
	env[0] = fmt.Sprintf("AHC_TOKEN=%s", "DEFAULT_TOKEN")
	i := 1

	for k, s := range config.Env {
		env[i] = fmt.Sprintf("%s=%s", k, s)
		i += 1
	}

	ahc_run_name_env_index := i
	ahc_run_seq_env_index := i + 1

	for _, run := range config.Experiment.Runs {
		fmt.Printf("Running for run %s with total sampling with %d\n", run.Name, run.SamplingCount)

		env[ahc_run_name_env_index] = fmt.Sprintf("AHC_RUN_NAME=%s", run.Name)

		for i := 0; i < run.SamplingCount; i++ {
			fmt.Printf("Running for run %s sampling id %d\n", run.Name, i)

			env[ahc_run_seq_env_index] = fmt.Sprintf("AHC_RUN_SEQ=%d", i)

			err = runContainer(config.Image, config.Command, env)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func checkRunner(connect_url string, connect_secret string) bool {
	connect_path := fmt.Sprintf("http://%s/api/runner/", connect_url)

	client := http.Client{}
	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return false
	}

	req.Header = http.Header{
		"Authorization": []string{fmt.Sprintf("Basic %s", connect_secret)},
	}

	res, err := client.Do(req)
	if err != nil {
		return false
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server, exiting...")
		return false
	}

	var data RunnerResponse
	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return false
	}

	fmt.Printf("Connected with runner %s\n", data.Name)

	return true
}

func checkForNewJob(connect_url string, connect_secret string) bool {
	connect_path := fmt.Sprintf("http://%s/api/jobs/", connect_url)

	client := http.Client{}
	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return false
	}

	req.Header = http.Header{
		"Authorization": []string{fmt.Sprintf("Basic %s", connect_secret)},
	}

	res, err := client.Do(req)
	if err != nil {
		return false
	}
	defer res.Body.Close()

	if res.StatusCode != 200 && res.StatusCode != 204 {
		fmt.Println("Could not connect to server, exiting...")
		return false
	}

	if res.StatusCode == 204 {
		fmt.Println("No new job found, skipping...")
		return true
	}

	var data ExperimentResponse
	json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return false
	}

	fmt.Printf("Found job from repository %s from upstream %s commit %s\n", data.Repository.Name, data.Repository.Upstream, data.Commit)

	runJob(data.Repository.Upstream)

	return true
}

func startDaemon(connect_url string, connect_secret string) {
	r := checkRunner(connect_url, connect_secret)

	if r {
		for range time.Tick(5 * time.Second) {
			r = checkForNewJob(connect_url, connect_secret)

			if !r {
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
				containerBindPath = "/data"
			}

			var err error

			err = initDocker()
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

					return runJob(upstream_url)
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
					connect_url := c.String("url")
					connect_secret := c.String("secret")

					fmt.Printf("Starting daemon for %s\n", connect_url)

					startDaemon(connect_url, connect_secret)

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
