from django.db import models
from ahc_users.models import User


class Repository(models.Model):
    """
    Model for storing repository data of users.
    """
    slug = models.TextField()
    name = models.TextField()
    upstream = models.TextField(null=True)
    upstream_type = models.TextField(null=True)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)


class RepositoryUser(models.Model):
    """
    Model for storing repository users.
    """
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.TextField()
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)
