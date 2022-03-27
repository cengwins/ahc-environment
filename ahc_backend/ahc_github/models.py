from functools import cached_property

from github import AuthenticatedUser, Github, PaginatedList, Repository, Branch

from django.db import models
from django.contrib.auth.models import User


class GithubProfile(models.Model):
    """
    Model for storing GitHub profiles of users.
    """

    user = models.OneToOneField(
        User, related_name="github_profile", on_delete=models.CASCADE
    )
    access_token = models.CharField(max_length=120)

    # AuthenticatedUser object's login attribute.
    github_username = models.CharField(max_length=120)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # TODO: add necessary fields to be stored in db

    @cached_property
    def github_client(self):
        return Github(self.access_token)

    def get_authenticated_user(self) -> AuthenticatedUser:
        return self.github_client.get_user()

    def get_repos(self, *args, **kwargs) -> PaginatedList:
        """Retrieves the repos the user has access to.

        Uses GitHub's GET /user/repos endpoint.

        args and kwargs are forwarded to AuthenticatedUser.get_repos() method.
        """
        return self.get_authenticated_user().get_repos(*args, **kwargs)

    def get_repo(self, repo_name: str) -> Repository:
        """Retrieves a repository given a full_name of a repository.

        full_name is of form {owner}/{repo_name}
        """
        return self.github_client.get_repo(full_name_or_id=repo_name)

    def get_branch(self, repo_name: str, branch_name: str) -> Branch:
        return self.github_client.get_repo(full_name_or_id=repo_name).get_branch(
            branch_name
        )

    def get_hash_of_last_commit(self, repo_name: str, branch_name: str) -> str:
        return self.get_branch(repo_name, branch_name).commit.sha

    def search_repos(self, search: str) -> PaginatedList:
        return self.github_client.search_repositories(
            f"user:{self.get_authenticated_user().login} {search} in:name"
        )

    def __str__(self):
        return self.user.get_full_name()


class GithubRepositoryDeployToken(models.Model):
    """
    Model for storing deploy key information
    """

    added_by = models.ForeignKey(
        User, related_name="github_deploy_tokens", on_delete=models.CASCADE
    )

    github_repository_id = models.PositiveBigIntegerField()
    owner_name = models.CharField(max_length=100, editable=False)
    repository_name = models.CharField(max_length=100, editable=False)

    private_key = models.TextField(editable=False)
    public_key = models.TextField(editable=False)
    key_signature = models.TextField(editable=False)
    # github_key_id = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner_name}/{self.repository_name} - {self.user.get_full_name()}"
