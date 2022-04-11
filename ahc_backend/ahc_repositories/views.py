from ahc_github.models import GithubProfile
from ahc_repositories.permissions import RepositoryAccessPermission
from django.contrib.auth.models import User

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    RetrieveDestroyAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
)
from rest_framework.request import Request

from .models import Repository, RepositoryUser
from .serializers import RepositorySerializer, RepositoryUserSerializer


class ListCreateRepositoriesAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return super().get_queryset().filter(users__user=self.request.user)

    def perform_create(self, serializer):
        repository = serializer.save()

        RepositoryUser.objects.create(repository=repository, user=self.request.user)

        return repository

    def create(self, request: Request, *args, **kwargs):
        github_profile: GithubProfile = self.request.user.github_profile
        upstream = request.data["upstream"]
        upstream_split = upstream.split("/")
        upstream_username = upstream_split[-2]
        upstream_repo_name = upstream_split[-1]
        full_name = "{}/{}".format(upstream_username, upstream_repo_name)
        github_repository = github_profile.get_repo(full_name)
        request.data["stargazers_count"] = github_repository.stargazers_count
        request.data["description"] = github_repository.description
        request.data["html_url"] = github_repository.html_url
        request.data["private"] = github_repository.private
        return super().create(request, *args, **kwargs)


class RetrieveUpdateDestroyRepositoriesAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    lookup_url_kwarg = "repository_id"

    def get_queryset(self):
        return super().get_queryset().filter(users__user=self.request.user)


class ListCreateRepositoryUsersAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = RepositoryUser.objects.all()
    serializer_class = RepositoryUserSerializer

    def create(self, request: Request, *args, **kwargs):
        email = request.data["email"]

        user = User.objects.get(email=email)

        request.data["user"] = user.pk

        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                repository=self.kwargs["repository_id"],
            )
        )


class RetrieveDestroyRepositoryUsersAPIView(RetrieveDestroyAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = RepositoryUser.objects.all()
    serializer_class = RepositoryUserSerializer
    lookup_url_kwarg = "member_id"

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                repository=self.kwargs["repository_id"],
            )
        )
