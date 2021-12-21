from django.db import models
from ahc_users.models import User


class GithubProfile(models.Model):
    """
    Model for storing GitHub profiles of users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.TextField()

    # TODO: add necessary fields to be stored in db
