from github import (
    Github,
    AuthenticatedUser,
    BadCredentialsException,
    Repository,
    GithubException,
    GithubObject,
    ContentFile,
)

from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView, Request, Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException

from .serializers import (
    GithubProfileSerializer,
    GithubRepositoryBranchSerializer,
    GithubRepositorySerializer,
    GithubCreateUpdateContentSerializer,
)

import hashlib

from .models import GithubProfile
from ahc_utils.helpers import BasicException


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


class CommitFileContentsToUpstreamAPIView(APIView):
    """
    Commits given plain text file contents (not base64!) to the upstream.

    See:
    https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request: Request, owner: str, repo: str, path: str):
        serial = GithubCreateUpdateContentSerializer(data=request.data)

        serial.is_valid(raise_exception=True)
        data = serial.data

        github_profile: GithubProfile = request.user.github_profile
        repo: Repository = github_profile.github_client.get_repo(f"{owner}/{repo}")
        if data.get("sha") is None:  # creating new file
            data["sha"] = "none"  # Required by PyGithub, Github API ignores this
        else:  # updating file, check whether there are actual changes
            content = data["content"]
            payload = f"blob {len(content)}\0{content}"
            digest = hashlib.sha1(bytes(payload, "utf-8")).hexdigest()
            if data["sha"] == digest:
                # update with no change
                exception = APIException(
                    detail=f"identical sha {data['sha']} implies that the file "
                    f"did not change."
                )
                exception.status_code = 409
                raise exception

        # Repository.update_file and Repository.create_file target the same endpoint
        # they are identical except update_file requires sha since Github API
        # requires the sha of the file to be updated in case of updating files
        # and not creating new ones. We can simply use update_file for both cases
        # since Github API ignores the sha field when a new file is created.
        try:
            result = repo.update_file(path=path, **data)
        except GithubException as e:
            exception = APIException(detail=e.data["message"])
            exception.status_code = e.status
            raise exception
        return Response(
            {
                "success": True,
                "commit": result["commit"].raw_data,
                "content": result["content"].raw_data,
            }
        )
