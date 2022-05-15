import uuid

from django.db import models
from django.db.models import F
from django.db.models.expressions import Window
from django.db.models.functions import Rank

from django.contrib.auth.models import User
from ahc_experiments.models import Experiment, ExperimentRun


def generate_random_runner_secret():
    return uuid.uuid4().hex


class RankedObjectsManager(models.Manager):
    use_for_related_fields = True

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .annotate(
                rank=Window(
                    expression=Rank(),
                    order_by=[
                        F("is_finished").asc(),
                        F("is_running").asc(),
                        F("priority").desc(),
                        F("created_at").asc(),
                    ],
                )
            )
        )


class Runner(models.Model):
    name = models.CharField(max_length=40)
    secret = models.CharField(max_length=100, default=generate_random_runner_secret)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RunnerJob(models.Model):
    ranked_objects = RankedObjectsManager()

    experiment = models.ForeignKey(
        Experiment, related_name="jobs", on_delete=models.CASCADE
    )
    creator = models.ForeignKey(
        User,
        related_name="jobs",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    experiment_runs = models.ManyToManyField(
        ExperimentRun,
        related_name="jobs",
        blank=True,
    )

    runner = models.ForeignKey(
        Runner, related_name="jobs", null=True, blank=True, on_delete=models.CASCADE
    )

    priority = models.PositiveIntegerField(default=0)

    is_running = models.BooleanField(default=False)
    is_finished = models.BooleanField(default=False)
    will_cancel = models.BooleanField(default=False)

    is_success = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def _rank(self):
        if self.is_finished or self.is_running:
            return None

        return self.rank

    @property
    def _priority(self):
        if self.is_finished or self.is_running:
            return None

        return self.priority

    def __str__(self):
        return f"{self.experiment.pk} - {self.created_at}"

    class Meta:
        ordering = ("is_finished", "is_running", "-priority", "created_at")
