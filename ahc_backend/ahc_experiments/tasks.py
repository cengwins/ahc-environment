import docker

from typing import Dict

from celery import shared_task

from .models import *

docker_client = docker.from_env()


@shared_task()
def run_experiment(experiment_run_id: int):
    experiment_run = ExperimentRun.objects.filter(id=experiment_run_id).first()

    if experiment_run:
        docker_env: Dict[str, str] = dict()
        docker_env["IS_AHC"] = "true"
        docker_env["AHC_EXPERIMENT_RUN_ID"] = str(experiment_run_id)

        container = docker_client.containers.run(
            "ubuntu",
            '/bin/sh -c "echo "$IS_AHC" && echo "$AHC_EXPERIMENT_RUN_ID""',
            environment=docker_env,
            detach=True,
        )

        result = container.wait()
        print(result)
        exit_code = result["StatusCode"]

        experiment_run.log_path = container.logs()
        experiment_run.exit_code = exit_code
        experiment_run.save()

        container.remove()
