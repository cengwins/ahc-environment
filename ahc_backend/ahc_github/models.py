from django.db import models
from ahc_users.models import User
from github import AuthenticatedUser, Github, PaginatedList, Repository, Branch


class GithubProfile(models.Model):
    """
    Model for storing GitHub profiles of users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.TextField()

    # TODO: add necessary fields to be stored in db

    def get_authenticated_user(self) -> AuthenticatedUser:
        g = Github(self.access_token)
        return g.get_user()

    def get_repos(self) -> PaginatedList:
        return self.get_authenticated_user().get_repos()

    def get_repo(self, repo_name: str) -> Repository:
        g = Github(self.access_token)
        return g.get_repo(full_name_or_id=repo_name)

    def get_branch(self, repo_name: str, branch_name: str) -> Branch:
        g = Github(self.access_token)
        return g.get_repo(full_name_or_id=repo_name).get_branch(branch_name)

    def get_hash_of_last_commit(self, repo_name: str, branch_name: str) -> str:
        return self.get_branch(repo_name, branch_name).commit.sha


class GithubRepositoryDeployToken(models.Model):
    """
    Model for storing deploy key informations
    """
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    github_repository_id = models.TextField()
    owner_name = models.TextField()
    repository_name = models.TextField()
    private_key = models.TextField()
    public_key = models.TextField()
    key_signature = models.TextField()
    github_key_id = models.TextField()
