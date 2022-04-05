import uuid
from rest_framework.views import APIView, Request, Response

from ahc_utils.helpers import unauthorized

from ahc_experiments.models import Experiment, ExperimentRun
from ahc_experiments.custom_storage import LogStorage
from ahc_runners.models import Runner, RunnerJob
from ahc_runners.serializers import RunnerJobSerializer, RunnerSerializer


log_storage = LogStorage()


def generate_uuid():
    return uuid.uuid4().hex


def fetch_runner_from_request(request: Request) -> Runner:
    if "Authorization" not in request.headers:
        raise unauthorized("no_auth_header")

    auth_header = request.headers["Authorization"]
    auth_header_items = auth_header.split(" ")

    if len(auth_header_items) != 2:
        raise unauthorized("wrong_auth_header")

    auth_header_prefix, auth_header_payload = auth_header_items

    if auth_header_prefix != "Basic":
        raise unauthorized("wrong_auth_header_prefix")

    runner = Runner.objects.filter(secret=auth_header_payload).first()
    if runner is None:
        raise unauthorized("wrong_auth_header_payload")

    return runner


class RetrieveRunnerAPIView(APIView):
    def get(self, request: Request):
        runner = fetch_runner_from_request(request)

        return Response(RunnerSerializer(runner).data)


class FetchRunnerJobAPIView(APIView):
    def get(self, request: Request):
        runner = fetch_runner_from_request(request)

        job = RunnerJob.objects.filter(runner=None).first()

        if job is None:
            return Response(None, 204)

        job.runner = runner
        job.save()

        return Response(RunnerJobSerializer(job).data)


class SubmitRunnerJobResultAPIView(APIView):
    def post(self, request: Request):
        runner = fetch_runner_from_request(request)

        job_id = request.data["id"]
        job = RunnerJob.objects.filter(id=job_id).first()
        if job is None or job.runner.id != runner.id:
            raise unauthorized("wrong_job")

        if "runs" in request.data:
            runs = request.data["runs"]

            experiment = job.experiment

            if experiment is None:
                raise unauthorized("no_experiment")

            for run in runs:
                file_name = generate_uuid()
                file = log_storage.open(file_name, "w")

                file.write(run["logs"])
                file.close()

                experiment_run = ExperimentRun.objects.create(
                    experiment=experiment,
                    started_at=run["started_at"],
                    finished_at=run["finished_at"],
                    exit_code=run["exit_code"],
                    log_path=file_name,
                )
                experiment_run.save()

        if "is_running" in request.data:
            job.is_running = request.data["is_running"]
            job.save()

        if "is_finished" in request.data:
            job.is_finished = request.data["is_finished"]
            job.save()

        return Response(None, 200)
