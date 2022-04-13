from slugify import slugify

from django.db import models

from ahc_users.models import User


class Repository(models.Model):
    """
    Model for storing repository data of users.
    """

    class RepositoryUpstreamTypes(models.TextChoices):
        GIT = "GIT"

    slug = models.CharField(max_length=40)
    private = models.BooleanField()

    html_url = models.CharField(max_length=255)

    description = models.CharField(max_length=255, null=True, blank=True)

    stargazers_count = models.IntegerField()

    # TODO (DK): This seems redundant. upstream field holds this info.
    # Let's check GET /repos/{owner}/{repo} response fields.
    name = models.CharField(max_length=100)

    upstream = models.CharField(max_length=150)
    upstream_type = models.CharField(
        max_length=3, choices=RepositoryUpstreamTypes.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.id})"

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    class Meta:
        ordering = ("-created_at",)

    @property
    def owner(self):
        return self.users.filter(type="OWNER").first()


class RepositoryUser(models.Model):
    """
    Model for storing repository users.
    """

    class RepositoryUserTypes(models.TextChoices):
        OWNER = "OWNER"
        COLLABORATOR = "COLLABORATOR"

    repository = models.ForeignKey(
        Repository, related_name="users", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User, related_name="repository_users", on_delete=models.CASCADE
    )

    type = models.CharField(max_length=12, choices=RepositoryUserTypes.choices)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()


class RepositoryEnvVariable(models.Model):
    """
    Model for storing environment variables for repositories of the users.
    """

    repository = models.ForeignKey(
        Repository, related_name="env_variables", on_delete=models.CASCADE
    )
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.repository.slug} - {self.name}"

    class Meta:
        ordering = ("name",)
