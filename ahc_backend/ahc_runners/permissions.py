from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import RunnerJob


class RunnerAccessPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        runner = request.runner

        return runner is not None


class RunnerJobAccessPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        runner = request.runner
        job_id = request.parser_context["kwargs"].get("job_id")

        if runner and job_id:
            return RunnerJob.ranked_objects.filter(id=job_id, runner=runner).exists()

        return False

    def has_object_permission(self, request: Request, view: APIView, obj) -> bool:
        return False
