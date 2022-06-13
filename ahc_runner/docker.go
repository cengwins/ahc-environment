package main

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"runtime"
	"strings"
	"time"
	"unicode"

	types "github.com/docker/docker/api/types"
	containertypes "github.com/docker/docker/api/types/container"
	mounttypes "github.com/docker/docker/api/types/mount"
	docker "github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	"github.com/google/uuid"
)

var dockerClient docker.APIClient

func initDocker() error {
	var err error
	dockerClient, err = docker.NewClientWithOpts(docker.FromEnv)
	if err != nil {
		return err
	}

	return nil
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

func getContainerLogs(containerId string) (string, error) {
	reader, err := dockerClient.ContainerLogs(context.Background(), containerId, types.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
	})
	if err != nil {
		return "", err
	}
	defer reader.Close()

	readerContent, _ := ioutil.ReadAll(reader)

	logs := string(readerContent)

	logs = strings.TrimFunc(logs, func(r rune) bool {
		return !unicode.IsGraphic(r) || !unicode.IsPrint(r)
	})

	return logs, nil
}

func runContainer(hostVolumePath string, image string, command string, env []string, preLogs string, tempLogChannel *chan string, cancelJobChannel *chan bool) (string, error) {
	dockerHostConfig := containertypes.HostConfig{
		Mounts: []mounttypes.Mount{
			{
				Type:   mounttypes.TypeBind,
				Source: hostVolumePath,
				Target: "/app",
			},
		},
	}

	if runtime.GOOS == "linux" {
		dockerHostConfig.Mounts = append(dockerHostConfig.Mounts, mounttypes.Mount{
			Type:   mounttypes.TypeBind,
			Source: "/dev/bus/usb",
			Target: "/dev/bus/usb",
		})

		dockerHostConfig.Privileged = true
	}

	ctx := context.Background()
	c, err := dockerClient.ContainerCreate(
		ctx,
		&containertypes.Config{
			Image:        image,
			Cmd:          []string{"/bin/sh", "-c", command},
			Env:          env,
			WorkingDir:   "/app",
			Tty:          true,
			AttachStdout: true,
			AttachStderr: true,
		},
		&dockerHostConfig,
		nil,
		nil,
		"",
	)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	err = dockerClient.ContainerStart(ctx, c.ID, types.ContainerStartOptions{})
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	finishContainerChannel := make(chan bool)
	go func() {
		for {
			select {
			case <-finishContainerChannel:
				break
			case <-*cancelJobChannel:
				timeout := 2 * time.Second

				dockerClient.ContainerStop(context.Background(), c.ID, &timeout)

				break
			}
		}
	}()

	for range time.Tick(3 * time.Second) {
		container, err := dockerClient.ContainerInspect(ctx, c.ID)
		if err != nil {
			return "", err
		}

		if !container.State.Running {
			break
		}

		logs, err := getContainerLogs(c.ID)
		if err != nil {
			return "", err
		}

		*tempLogChannel <- preLogs + logs
	}

	logs, err := getContainerLogs(c.ID)
	if err != nil {
		return "", err
	}

	finishContainerChannel <- true

	err = dockerClient.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{
		Force: true,
	})
	if err != nil {
		return "", err
	}

	return logs, nil
}
