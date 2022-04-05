package main

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path"

	jsonmessage "github.com/docker/docker/pkg/jsonmessage"
	git "github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"gopkg.in/yaml.v2"
)

const AHC_FILENAME = "ahc.yml"

type TopologyConfiguration struct {
	Name  string   `yaml:"name"`
	Nodes []string `yaml:"nodes"`
	Links []string `yaml:"links"`
}

type ExperimentRunConfiguration struct {
	Name          string `yaml:"name"`
	Topology      string `yaml:"topology"`
	SamplingCount int    `yaml:"sampling_count"`
}

type ExperimentConfiguration struct {
	Runs []ExperimentRunConfiguration `yaml:"runs"`
}

type AHCConfiguration struct {
	Image   string            `yaml:"image"`
	Command string            `yaml:"command"`
	Env     map[string]string `yaml:"env"`

	Topologies []TopologyConfiguration `yaml:"topologies"`
	Experiment ExperimentConfiguration `yaml:"experiment"`
}

func printJsonStreamToScreen(wr io.Writer, rd io.ReadCloser) {
	defer rd.Close()

	jsonmessage.DisplayJSONMessagesStream(rd, wr, 0, false, nil)
}

func gitClone(containerVolumePath string, url string, outStream io.Writer) error {
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

func readAHCConfig(containerVolumePath string) (AHCConfiguration, error) {
	filePath := path.Join(containerVolumePath, AHC_FILENAME)

	if _, err := os.Stat(filePath); !errors.Is(err, os.ErrNotExist) {
		buf, err := ioutil.ReadFile(filePath)
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

	defaultConfig := AHCConfiguration{
		Image:   "python:3-alpine",
		Command: "python3 main.py",
		Experiment: ExperimentConfiguration{
			Runs: []ExperimentRunConfiguration{
				{
					Name:          "default_run",
					Topology:      "default_topology",
					SamplingCount: 1,
				},
			},
		},
		Topologies: []TopologyConfiguration{
			{
				Name:  "default_topology",
				Nodes: []string{"node1", "node2"},
				Links: []string{"node1:node2"},
			},
		},
	}

	return defaultConfig, nil
}
