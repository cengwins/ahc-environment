package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

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

type RunnerJobResponse struct {
	Experiment ExperimentResponse `json:"experiment"`
}

type SubmitJobResultRequestRun struct {
	StartedAt  string `json:"started_at"`
	FinishedAt string `json:"finished_at"`
	Logs       string `json:"logs"`
	ExitCode   int    `json:"exit_code"`
}

type SubmitJobResultRequest struct {
	ExperimentId int                         `json:"experiment_id"`
	Runs         []SubmitJobResultRequestRun `json:"runs"`
}

var serverUrl string
var serverSecret string

func setServerCredentials(url string, secret string) {
	serverUrl = url
	serverSecret = secret
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

func submitRunnerJobResult(experimentId int, result []SubmitJobResultRequestRun) error {
	data := SubmitJobResultRequest{
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

	var data RunnerJobResponse
	json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return err
	}

	experiment := data.Experiment

	fmt.Printf("Found job from repository %s from upstream %s commit %s\n", experiment.Repository.Name, experiment.Repository.Upstream, experiment.Commit)

	result, err := runJob(experiment.Repository.Upstream)
	if err != nil {
		return err
	}

	submitRunnerJobResult(experiment.Id, result)

	return nil
}
