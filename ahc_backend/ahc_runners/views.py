import uuid
from rest_framework.views import APIView, Request, Response

from ahc_utils.helpers import unauthorized

from ahc_experiments.models import ExperimentRun
from ahc_experiments.custom_storage import LogStorage
from ahc_runners.models import RunnerJob
from ahc_runners.serializers import RunnerJobSerializer, RunnerSerializer

from .permissions import RunnerAccessPermission, RunnerJobAccessPermission

log_storage = LogStorage()


def generate_uuid():
    return uuid.uuid4().hex


class RetrieveRunnerAPIView(APIView):
    permission_classes = (RunnerAccessPermission,)

    def get(self, request: Request):
        runner = request.runner

        return Response(RunnerSerializer(runner).data)


class FetchRunnerJobAPIView(APIView):
    permission_classes = (RunnerAccessPermission,)

    def get(self, request: Request):
        runner = request.runner

        job = RunnerJob.objects.filter(runner=None).first()

        if job is None:
            return Response(None, 204)

        job.runner = runner
        job.save()

        return Response(RunnerJobSerializer(job).data)


class SubmitRunnerJobResultAPIView(APIView):
    permission_classes = (RunnerAccessPermission, RunnerJobAccessPermission)

    def post(self, request: Request, job_id):
        runner = request.runner

        job = RunnerJob.objects.filter(id=job_id).first()
        if job is None or job.runner.id != runner.id:
            raise unauthorized("wrong_job")

        if "experiment" in request.data and "runs" in request.data["experiment"]:
            runs = request.data["experiment"]["runs"]

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
