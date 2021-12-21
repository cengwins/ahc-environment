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