from rest_framework.views import APIView, Request, Response

from ahc_utils.helpers import unauthorized

from ahc_experiments.serializers import ExperimentWithRepositorySerializer
from ahc_runners.models import Runner, RunnerJob
from ahc_runners.serializers import RunnerSerializer


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

        return Response(ExperimentWithRepositorySerializer(job.experiment).data)
