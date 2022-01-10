import github.GithubException
from github import Github

from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView, Request, Response
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    GithubProfileSerializer,
    GithubRepositoryBranchSerializer,
    GithubRepositorySerializer,
)

from .models import GithubProfile


class ListGithubRepositoriesAPIView(APIView):
    """
    Retrieves repositories that the authenticated user can access.
    The authenticated user has explicit permission to access repositories they own,
    repositories where they are a collaborator,
    and repositories that they can access through an organization membership.
    Ref: https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        search = request.query_params.get("search") or ""

        if len(search) < 3:
            raise ValidationError({"search": "length must be at least 3"})

        github_profile: GithubProfile = request.user.github_profile
        github_repositories = github_profile.search_repos(search)

        return Response(GithubRepositorySerializer(github_repositories, many=True).data)


class GetBranchesOfTheRepositoryAPIView(APIView):
    """
    Retrieves the branches of the repository that the authenticated user can access.
    Ref: https://docs.github.com/en/rest/reference/branches#list-branches
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, owner: str, repo: str):
        github_profile: GithubProfile = request.user.github_profile
        branch_list = github_profile.get_repo(f"{owner}{repo}").get_branches()

        return Response(GithubRepositoryBranchSerializer(branch_list).data)


class GithubProfileAPIView(CreateAPIView):
    """
    Create GithubProfile with personal access token.
    """

    permission_classes = (IsAuthenticated,)
    queryset = GithubProfile.objects.all()
    serializer_class = GithubProfileSerializer

    def perform_create(self, serializer):
        access_token = serializer.data["access_token"]

        g = Github(access_token)
        try:
            g.get_user()
        except github.GithubException:
            raise ValidationError({"access_token": "Access token is invalid."})

        (github_profile, _) = GithubProfile.objects.update_or_create(
            access_token=access_token, defaults={"user": self.request.user}
        )
        github_profile.save()

        return github_profile

    def create(self, request, *args, **kwargs) -> Response:
        super().create(request, *args, **kwargs)

        return Response({"success": True})
