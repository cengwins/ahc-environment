package main

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"runtime"
	"strings"
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

func runContainer(hostVolumePath string, image string, command string, env []string) (string, error) {
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
			Image:      image,
			Cmd:        []string{"/bin/sh", "-c", command},
			Env:        env,
			WorkingDir: "/app",
		},
		&dockerHostConfig,
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

	readerContent, _ := ioutil.ReadAll(reader)

	err = dockerClient.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{})
	if err != nil {
		return "", err
	}

	logs := string(readerContent)

	logs = strings.ReplaceAll(logs, "\r", "\n")
	logs = strings.TrimFunc(logs, func(r rune) bool {
		return !unicode.IsGraphic(r)
	})

	return logs, nil
}
