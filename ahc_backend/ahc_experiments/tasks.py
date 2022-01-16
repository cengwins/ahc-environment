import docker
import uuid

from celery import shared_task
from django.utils import timezone

from .models import *
from storages.backends.s3boto3 import S3Boto3Storage


class LogStorage(S3Boto3Storage):
    bucket_name = 'logs'


docker_client = None
log_storage_inst = LogStorage()


def generate_uuid():
    return uuid.uuid4().hex


@shared_task()
def run_experiment(experiment_id: int):
    global docker_client

    if not docker_client:
        docker_client = docker.from_env()

    experiment: Experiment = Experiment.objects.get(id=experiment_id)
    if not experiment.commit:
        experiment.fetch_commit_from_reference()

    experiment_run = ExperimentRun.objects.create(
        experiment=experiment, started_at=timezone.now()
    )

    container = docker_client.containers.run(
        "boza.ceng.metu.edu.tr:8083/ahc/runner:dev",
        ["/ahc_runner", "start", "--url", experiment.repository.upstream],
        name=uuid.uuid4().hex,
        environment={
            "AHC_DATA_VOLUME": "/data",
            "AHC_HOST_BIND_PATH": "/tmp/ahc-runner",
        },
        volumes=[
            "/var/run/docker.sock:/var/run/docker.sock",
            "/tmp/ahc-runner:/data",
        ],
        detach=True,
    )

    result = container.wait()
    exit_code = result["StatusCode"]
    logs = container.logs()
    logs = (
        logs.decode("utf-8", errors="replace").replace("\x00", "").replace("\r", "\n")
    )

    experiment_run.finished_at = timezone.now()
    file_name = generate_uuid()

    file = log_storage_inst.open(file_name, "w")

    file.write(logs)
    file.close()

    experiment_run.log_path = file_name

    experiment_run.exit_code = exit_code
    experiment_run.save()

    container.remove()
