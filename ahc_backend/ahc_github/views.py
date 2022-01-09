import github.GithubException
from github import Github
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from .serializers import GithubRepositorySerializer
import requests
from .models import GithubProfile


class GetRepositoriesAPIView(APIView):
    """
    Retrieves repositories that the authenticated user can access.
    The authenticated user has explicit permission to access repositories they own,
    repositories where they are a collaborator,
    and repositories that they can access through an organization membership.
    Ref: https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        github_profile = request.user.github_profile
        search_url = "https://api.github.com/user/repos"
        headers = {"Authorization": "Token " + github_profile.access_token}
        response = requests.get(search_url, headers=headers)

        return Response(status=response.status_code, data=response.json())

        # or we can use a custom serializer(RepositorySerializer) and return only necessary fields:
        # return Response([RepositorySerializer(repo).data for repo in github_profile.get_repos()])


class GetBranchesOfTheRepositoryAPIView(APIView):
    """
    Retrieves the branches of the repository that the authenticated user can access.
    Ref: https://docs.github.com/en/rest/reference/branches#list-branches
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        github_profile = request.user.github_profile
        owner = kwargs.get("owner", None)
        repo = kwargs.get("repo", None)
        search_url = "https://api.github.com/repos/{}/{}/branches".format(owner, repo)
        headers = {"Authorization": "Token " + github_profile.access_token}
        response = requests.get(search_url, headers=headers)

        return Response(status=response.status_code, data=response.json())


class CreateGithubProfileAPIView(APIView):
    """
    Create GithubProfile with personal access token.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        access_token = request.data.get("Token", None)
        if access_token is None:
            return Response(
                status=403, data={"detail": "Access token is not provided."}
            )

        g = Github(access_token)
        try:
            github_username = g.get_user().login
        except github.GithubException:
            return Response(status=403, data={"detail": "Access token is invalid."})

        github_profile = GithubProfile()
        github_profile.access_token = access_token
        github_profile.user = request.user

        try:
            github_profile.save()
        except Exception:
            return Response(
                status=403, data={"detail": "You have already a GithubProfile."}
            )

        return Response(
            {
                "success": True,
            }
        )
