from github import Github, AuthenticatedUser, BadCredentialsException

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
        branch_list = github_profile.get_repo(f"{owner}/{repo}").get_branches()

        return Response(GithubRepositoryBranchSerializer(branch_list, many=True).data)


class GithubProfileAPIView(CreateAPIView):
    """
    Create GithubProfile with personal access token.
    """

    permission_classes = (IsAuthenticated,)
    queryset = GithubProfile.objects.all()
    serializer_class = GithubProfileSerializer

    def perform_create(self, serializer: GithubProfileSerializer):
        access_token = serializer.validated_data["access_token"]

        # (DK): g.get_user() does not raise any exceptions, invoking methods of the
        # returned object does. Instead, we should check the oauth_scopes property of
        # the Github object.
        g = Github(access_token)
        g_user: AuthenticatedUser = g.get_user()

        try:
            _ = g_user.name  # TERRIBLE

        except BadCredentialsException:
            if g.oauth_scopes is None:
                raise ValidationError({"access_token": "Access token is invalid."})

        if "repo" not in g.oauth_scopes:
            raise ValidationError(
                {"access_token": "Access token should have " "scope `repo`."}
            )

        # Overrides previous token if exists.
        try:
            github_profile = GithubProfile.objects.get(user=self.request.user)
            github_profile.access_token = access_token
            github_profile.github_username = g_user.login
            github_profile.save()
        except:  # TODO: (DK) Do not swallow the exception.
            github_profile = GithubProfile.objects.create(
                user=self.request.user,
                access_token=access_token,
                github_username=g_user.login,
            )
            github_profile.save()

        return github_profile

    def create(self, request, *args, **kwargs) -> Response:
        super().create(request, *args, **kwargs)

        return Response({"success": True})
