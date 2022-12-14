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
	Id          int                `json:"id"`
	Experiment  ExperimentResponse `json:"experiment"`
	IsRunning   bool               `json:"is_running"`
	IsFinished  bool               `json:"is_finished"`
	IsSuccess   bool               `json:"is_success"`
	WillCancel  bool               `json:"will_cancel"`
	GitHubToken string             `json:"github_token"`
}

type SubmitJobResultRequestExperimentRun struct {
	StartedAt  string `json:"started_at"`
	FinishedAt string `json:"finished_at"`
	Logs       string `json:"logs"`
	ExitCode   int    `json:"exit_code"`
}

type SubmitJobResultRequestExperiment struct {
	Runs []SubmitJobResultRequestExperimentRun `json:"runs"`
}

type SubmitJobResultRequest struct {
	Id         int                              `json:"id"`
	Experiment SubmitJobResultRequestExperiment `json:"experiment"`
	IsRunning  bool                             `json:"is_running"`
	IsFinished bool                             `json:"is_finished"`
	IsSuccess  bool                             `json:"is_success"`
}

type SubmitJobTempRunLogsRequest struct {
	Id   int    `json:"id"`
	Logs string `json:"logs"`
}

var serverUrl string
var serverSecret string

func setServerCredentials(url string, secret string) {
	serverUrl = url
	serverSecret = secret
}

func makeHttpRequest(req *http.Request) (*http.Response, error) {
	client := http.Client{}
	req.Header = http.Header{
		"Authorization": []string{fmt.Sprintf("Runner %s", serverSecret)},
		"Content-Type":  []string{"application/json"},
	}

	res, err := client.Do(req)

	return res, err
}

func fetchRunnerInfo() error {
	connect_path := fmt.Sprintf("http://%s/api/runner/", serverUrl)

	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return err
	}

	res, err := makeHttpRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		if res.StatusCode == 401 {
			fmt.Println("Could not authenticate runner")
			return errors.New("Could not authenticate runner")
		}

		fmt.Println("Could not connect to server")
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

func submitJobResult(job *RunnerJobResponse, result []SubmitJobResultRequestExperimentRun, isRunning bool, isFinished bool, isSuccess bool) error {
	data := SubmitJobResultRequest{
		Id:         job.Id,
		IsRunning:  isRunning,
		IsFinished: isFinished,
		IsSuccess:  isSuccess,
	}

	if result != nil {
		data.Experiment = SubmitJobResultRequestExperiment{
			Runs: result,
		}
	}

	body, err := json.Marshal(data)
	if err != nil {
		return err
	}

	connect_path := fmt.Sprintf("http://%s/api/runner/jobs/%d/submit/", serverUrl, job.Id)

	req, err := http.NewRequest("POST", connect_path, bytes.NewReader(body))
	if err != nil {
		return err
	}

	res, err := makeHttpRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server")
		return errors.New("Could not connect to server")
	}

	return nil
}

func submitJobTempRunLogs(job *RunnerJobResponse, logs string) error {
	data := SubmitJobTempRunLogsRequest{
		Id:   job.Id,
		Logs: logs,
	}

	body, err := json.Marshal(data)
	if err != nil {
		return err
	}

	connect_path := fmt.Sprintf("http://%s/api/runner/jobs/%d/templog/", serverUrl, job.Id)

	req, err := http.NewRequest("POST", connect_path, bytes.NewReader(body))
	if err != nil {
		return err
	}

	res, err := makeHttpRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server")
		return errors.New("Could not connect to server")
	}

	return nil
}

func checkForNewJob() (RunnerJobResponse, error) {
	connect_path := fmt.Sprintf("http://%s/api/runner/jobs/", serverUrl)

	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return RunnerJobResponse{}, err
	}

	res, err := makeHttpRequest(req)
	if err != nil {
		return RunnerJobResponse{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 && res.StatusCode != 204 {
		fmt.Println("Could not connect to server")
		return RunnerJobResponse{}, errors.New("Could not connect to server")
	}

	if res.StatusCode == 204 {
		return RunnerJobResponse{}, errors.New("No new job found, skipping...")
	}

	var data RunnerJobResponse
	json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return RunnerJobResponse{}, err
	}

	return data, nil
}

func fetchJobWithId(jobId int) (RunnerJobResponse, error) {
	connect_path := fmt.Sprintf("http://%s/api/runner/jobs/%d/", serverUrl, jobId)

	req, err := http.NewRequest("GET", connect_path, nil)
	if err != nil {
		return RunnerJobResponse{}, err
	}

	res, err := makeHttpRequest(req)
	if err != nil {
		return RunnerJobResponse{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		fmt.Println("Could not connect to server")
		return RunnerJobResponse{}, errors.New("Could not connect to server")
	}

	var data RunnerJobResponse
	json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return RunnerJobResponse{}, err
	}

	return data, nil
}
