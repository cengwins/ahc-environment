import re
import git

from django.core.validators import RegexValidator
from django.db import models

from ahc_repositories.models import Repository


def fetch_commit_hash(upsteam: str, reference: str, heads=False, tags=False):
    git_client = git.cmd.Git()

    heads = git_client.ls_remote(
        upsteam,
        reference,
        heads=heads,
        tags=tags,
        quiet=True,
    ).splitlines()

    if len(heads) >= 1:
        heads = list(map(lambda x: x.split("\t"), heads))

        prefix = "tags" if tags else "heads"
        for (commit_hash, head_name) in heads:
            if head_name == f"refs/{prefix}/{reference}":
                return commit_hash


class Experiment(models.Model):
    """
    Model representing a experiment setup.
    """

    class ExperimentReferenceTypes(models.TextChoices):
        TAG = "TAG"
        COMMIT = "COMMIT"
        BRANCH = "BRANCH"

    repository = models.ForeignKey(
        Repository, related_name="experiments", on_delete=models.CASCADE
    )
    # For each repository, subsequent experiment's sequence_id are incremented by one.
    sequence_id = models.PositiveIntegerField()
    # Git commits are exactly 40-digit hexadecimal values
    commit = models.CharField(
        validators=[RegexValidator(regex=re.compile("^[0-9a-zA-Z]{40}$"))],
        max_length=40,
    )
    reference = models.CharField(max_length=80)
    reference_type = models.CharField(
        max_length=6, choices=ExperimentReferenceTypes.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def fetch_commit_from_reference(self):
        if self.reference_type == Experiment.ExperimentReferenceTypes.COMMIT:
            self.commit = self.reference
            self.save()

        elif self.reference_type == Experiment.ExperimentReferenceTypes.BRANCH:
            commit_hash = fetch_commit_hash(
                self.repository.upstream, self.reference, heads=True
            )

            if commit_hash:
                self.commit = commit_hash
                self.save()

        elif self.reference_type == Experiment.ExperimentReferenceTypes.BRANCH:
            commit_hash = fetch_commit_hash(
                self.repository.upstream, self.reference, tags=True
            )

            if commit_hash:
                self.commit = commit_hash
                self.save()

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                Experiment.objects.filter(repository=self.repository)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                or 0
            ) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.repository.name} - Experiment #{self.sequence_id} - {self.commit}"
        )


class ExperimentRun(models.Model):
    """
    Statistics of a experiment run.
    """

    experiment = models.ForeignKey(
        Experiment, related_name="runs", on_delete=models.CASCADE
    )
    sequence_id = models.PositiveIntegerField()

    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    exit_code = models.IntegerField(null=True, blank=True)
    log_path = models.CharField(max_length=4096, null=True, blank=True)  # PATH_MAX

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                ExperimentRun.objects.filter(experiment=self.experiment)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                or 0
            ) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Experiment {self.experiment.id} - Run #{self.sequence_id}"


class ExperimentMetric(models.Model):
    """
    Model for metrics of a experiment run.
    """

    class ExperimentMetricTypes(models.TextChoices):
        SYSTEM = "SYSTEM"
        USER = "USER"

    experiment_run = models.ForeignKey(
        ExperimentRun, related_name="metrics", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=40)
    type = models.CharField(max_length=6, choices=ExperimentMetricTypes.choices)

    value_float = models.FloatField(null=True, blank=True)
    value_int = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ExperimentRun {self.experiment_run.id} - {self.name}"


"""
(DK): My understanding is that there is a one-to-many relation between metrics and
their aliases. If this is the case alias model and the schema should reflect this.
Also, It is not very clear to me what updated_at field signifies.

This one will be implemented later (2021-28-12)
"""

# class ExperimentRunMetricAlias(models.Model):
#     """Aliases for experiment metrics.
#
#     Attributes:
#         id: int
#         experiment_run: int (experiment one-to-many)
#         type: string
#         name: string
#         alias: string
#         created_at: datetime
#         updated_at: datetime
#     """
#
#     pass  # TODO: Fill me with fields.
#

"""
This one will be implemented later (2021-28-12)
"""


# class ExperimentActivityLog(models.Model):
#     """TODO: describe me.
#
#     Attributes:
#         user: int (user one-to-many)?
#         experiment: int (experiment ?-to-?)
#         type: string
#         target: string
#         created_at: datetime
#         updated_at: datetime
#     """
#     user = models.ForeignKey(ahc_users.models.User)
#     experiment = models.ForeignKey(Experiment)
#
