package main

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path"
	"strings"
	"time"

	jsonmessage "github.com/docker/docker/pkg/jsonmessage"
	git "github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"gopkg.in/yaml.v2"
)

const AHC_FILENAME = "ahc.yml"
const AHC_FILENAME_FALLBACK = ".ahc.yml"

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

	Files []string `yaml:"files"`
}

func printJsonStreamToScreen(wr io.Writer, rd io.ReadCloser) {
	defer rd.Close()

	jsonmessage.DisplayJSONMessagesStream(rd, wr, 0, false, nil)
}

func gitClone(containerVolumePath string, url string, token string, outStream io.Writer) (*git.Repository, error) {
	branch := ""

	if len(token) > 0 {
		url = strings.Replace(url, "http://", fmt.Sprintf("http://%s@", token), 1)
		url = strings.Replace(url, "https://", fmt.Sprintf("https://%s@", token), 1)
	}

	repo, err := git.PlainClone(containerVolumePath, false, &git.CloneOptions{
		InsecureSkipTLS: true,
		Depth:           1,
		URL:             url,
		ReferenceName:   plumbing.NewBranchReferenceName("main"),
		SingleBranch:    true,
		Progress:        outStream,
	})

	if err == nil {
		branch = "main"
	} else {
		repo, err = git.PlainClone(containerVolumePath, false, &git.CloneOptions{
			InsecureSkipTLS: true,
			Depth:           1,
			URL:             url,
			ReferenceName:   plumbing.NewBranchReferenceName("master"),
			SingleBranch:    true,
			Progress:        outStream,
		})

		if err == nil {
			branch = "master"
		} else {
			return nil, err
		}
	}

	hash, err := repo.ResolveRevision(plumbing.Revision(branch))
	if err != nil {
		return nil, err
	}

	fmt.Printf("Successfully checkout %s\n", hash)

	return repo, nil
}

func gitCommitAndPushWithGlobs(repo *git.Repository, globs []string, outStream io.Writer) error {
	if len(globs) > 0 {

		w, err := repo.Worktree()
		if err != nil {
			return err
		}

		for _, s := range globs {
			w.AddGlob(s)
		}

		_, err = w.Commit("Added files by AHC Server [skip ci]", &git.CommitOptions{
			Author: &object.Signature{
				Email: "ahc@ceng.metu.edu.tr",
				Name:  "AHC Server",
				When:  time.Now(),
			},
		})
		if err != nil {
			return err
		}

		err = w.Pull(&git.PullOptions{
			RemoteName:   "origin",
			Progress:     outStream,
			SingleBranch: true,
		})
		if err != nil {
			fmt.Print("WARNING: ")
			fmt.Println(err)
		}

		err = repo.Push(&git.PushOptions{
			RemoteName: "origin",
			Progress:   outStream,
		})
		if err != nil {
			return err
		}

		fmt.Println("New files are uploaded to git.")

		return nil
	}

	return nil
}

func readAHCConfig(containerVolumePath string) (AHCConfiguration, error) {
	filePath := path.Join(containerVolumePath, AHC_FILENAME)

	if _, err := os.Stat(filePath); errors.Is(err, os.ErrNotExist) {
		filePath = path.Join(containerVolumePath, AHC_FILENAME_FALLBACK)

		if _, err := os.Stat(filePath); errors.Is(err, os.ErrNotExist) {
			filePath = ""
		}
	}

	if filePath != "" {
		buf, err := ioutil.ReadFile(filePath)
		if err == nil {
			c := AHCConfiguration{}
			err = yaml.Unmarshal(buf, &c)
			if err == nil {
				return c, nil
			}
		}
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
