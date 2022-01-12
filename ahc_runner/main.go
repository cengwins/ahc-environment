package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"

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

type AHCConfiguration struct {
	Image   string
	Command string
	Env     map[string]string
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
			},
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
				containerBindPath = hostBindPath
			}

			var err error

			err = initDocker()
			if err != nil {
				return err
			}
			volumeId = uuid.NewString()
			containerVolumePath = fmt.Sprintf("%s/%s", containerBindPath, volumeId)
			hostVolumePath = fmt.Sprintf("%s/%s", hostBindPath, volumeId)

			fmt.Printf("Using directory %s\n", containerVolumePath)

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

					env := make([]string, len(config.Env))
					i := 0
					for k, s := range config.Env {
						env[i] = fmt.Sprintf("%s=%s", k, s)
						i += 1
					}

					err = runContainer(config.Image, config.Command, env)
					if err != nil {
						return err
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
