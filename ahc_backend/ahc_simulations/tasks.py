import docker

from typing import Dict

from celery import shared_task

from .models import *

docker_client = docker.from_env()


@shared_task()
def run_simulation(simulation_run_id: int):
    simulation_run = SimulationRun.objects.filter(id=simulation_run_id).first()

    if simulation_run:
        docker_env: Dict[str, str] = dict()
        docker_env["IS_AHC"] = "true"
        docker_env["AHC_SIMULATION_RUN_ID"] = str(simulation_run_id)

        container = docker_client.containers.run(
            "ubuntu",
            '/bin/sh -c "echo "$IS_AHC" && echo "$AHC_SIMULATION_RUN_ID""',
            environment=docker_env,
            detach=True,
        )

        result = container.wait()
        print(result)
        exit_code = result["StatusCode"]

        simulation_run.log_path = container.logs()
        simulation_run.exit_code = exit_code
        simulation_run.save()

        container.remove()
