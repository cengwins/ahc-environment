from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import Repository, RepositoryUser


class RepositoryAccessPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        repo_id = request.parser_context["kwargs"].get("repository_id")

        if repo_id:
            return RepositoryUser.objects.filter(
                repository=repo_id, user=request.user
            ).exists()

        return False

    def has_object_permission(self, request: Request, view: APIView, obj) -> bool:
        if isinstance(obj, Repository):
            return obj.users.filter(user=request.user).exists()

        return False
