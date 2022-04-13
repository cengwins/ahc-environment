package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"
	"unicode"

	types "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/google/uuid"
	cli "github.com/urfave/cli/v2"
)

var containerBindPath string
var hostBindPath string

func startJobStatusUpdateService(job *RunnerJobResponse, cancelChannel *chan bool) {
	var err error

	for range time.Tick(5 * time.Second) {
		*job, err = fetchJobWithId(job.Id)
		if err != nil {
			continue
		}

		if job.IsFinished {
			fmt.Printf("Job with id %d finished, exiting from update status service\n", job.Id)

			break
		}

		if job.WillCancel {
			*cancelChannel <- true

			break
		}
	}
}

func runJob(job *RunnerJobResponse) ([]SubmitJobResultRequestExperimentRun, error) {
	var resultBuffer bytes.Buffer
	cancelChannel := make(chan bool)
	result := make([]SubmitJobResultRequestExperimentRun, 0)
	// bServer := new(broadcastserver.SocketServer)

	// go bServer.Start()
	go startJobStatusUpdateService(job, &cancelChannel)

	volumeId := uuid.NewString()
	containerVolumePath := fmt.Sprintf("%s/%s", containerBindPath, volumeId)
	hostVolumePath := fmt.Sprintf("%s/%s", hostBindPath, volumeId)

	fmt.Printf("Using directory %s\n", containerVolumePath)

	err := gitClone(containerVolumePath, job.Experiment.Repository.Upstream, &resultBuffer)
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

	runs := config.Experiment.Runs

	if len(runs) == 0 {
		runs = make([]ExperimentRunConfiguration, 1)

		runs[0] = ExperimentRunConfiguration{
			Name:          "run1",
			Topology:      "sample",
			SamplingCount: 1,
		}
	}

	prelogs := resultBuffer.String()
	prelogs = strings.ReplaceAll(prelogs, "\r", "\n")
	prelogs = strings.TrimFunc(prelogs, func(r rune) bool {
		return !unicode.IsGraphic(r) || !unicode.IsPrint(r)
	})

	fmt.Println(prelogs)

	for _, run := range runs {
		fmt.Printf("Running for run %s with total sampling with %d\n", run.Name, run.SamplingCount)

		env[ahc_run_name_env_index] = fmt.Sprintf("AHC_RUN_NAME=%s", run.Name)

		for i := 0; i < run.SamplingCount; i++ {
			fmt.Printf("Running for run %s sampling id %d\n", run.Name, i)

			env[ahc_run_seq_env_index] = fmt.Sprintf("AHC_RUN_SEQ=%d", i)

			startTime := time.Now()
			logs, err := runContainer(hostVolumePath, containerImage, config.Command, env, &cancelChannel)
			if err != nil {
				return result, err
			}
			endTime := time.Now()

			if job.WillCancel {
				logs += "\n[SYSTEM] Stopping the experiment after user request.\n"
			}

			result = append(result, SubmitJobResultRequestExperimentRun{
				StartedAt:  startTime.Format("2006-01-02 15:04:05.000000"),
				FinishedAt: endTime.Format("2006-01-02 15:04:05.000000"),
				ExitCode:   0,
				Logs:       fmt.Sprintf("[SYSTEM] Run: %s\n[SYSTEM] Sampling Sequence: %d\n\n%s\n", run.Name, i, logs),
			})

			if job.WillCancel {
				break
			}
		}

		if job.WillCancel {
			break
		}
	}

	// bServer.Stop()

	return result, nil
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

					r := fetchRunnerInfo()

					if r == nil {
						for range time.Tick(5 * time.Second) {
							job, r := checkForNewJob()
							if r != nil {
								fmt.Println(r)
								continue
							}

							fmt.Printf("Found job from repository %s from upstream %s commit %s\n", job.Experiment.Repository.Name, job.Experiment.Repository.Upstream, job.Experiment.Commit)

							submitJobResult(&job, nil, true, false, true)
							result, err := runJob(&job)
							if err != nil {
								fmt.Println(err)
								submitJobResult(&job, result, false, true, false)
							} else {
								submitJobResult(&job, result, false, true, true)
							}
						}
					}

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
