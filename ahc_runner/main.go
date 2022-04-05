package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	types "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/google/uuid"
	cli "github.com/urfave/cli/v2"
)

var containerBindPath string
var hostBindPath string

func runJob(upstream_url string) ([]SubmitRunnerJobRequestRun, error) {
	var resultBuffer bytes.Buffer

	result := make([]SubmitRunnerJobRequestRun, 0)

	volumeId := uuid.NewString()
	containerVolumePath := fmt.Sprintf("%s/%s", containerBindPath, volumeId)
	hostVolumePath := fmt.Sprintf("%s/%s", hostBindPath, volumeId)

	fmt.Printf("Using directory %s\n", containerVolumePath)

	err := gitClone(containerVolumePath, upstream_url, &resultBuffer)
	if err != nil {
		return result, err
	}

	config, err := readAHCConfig(containerVolumePath)
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

	prelogs := resultBuffer.String()
	prelogs = strings.ReplaceAll(prelogs, "\x00", "")
	prelogs = strings.ReplaceAll(prelogs, "\r", "\n")

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
				Logs:       fmt.Sprintf("Run: %s\nSampling Sequence: %d\n\n%s\n", run.Name, i, logs),
			}
			k += 1
		}
	}

	return result, nil
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
					serverUrl := c.String("url")
					serverSecret := c.String("secret")

					setServerCredentials(serverUrl, serverSecret)

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
