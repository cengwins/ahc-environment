import uuid

from django.db import models

from ahc_experiments.models import Experiment, ExperimentRun


def generate_random_runner_secret():
    return uuid.uuid4().hex


class Runner(models.Model):
    name = models.CharField(max_length=40)
    secret = models.CharField(max_length=100, default=generate_random_runner_secret)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class RunnerJob(models.Model):
    experiment = models.ForeignKey(
        Experiment, related_name="jobs", on_delete=models.CASCADE
    )

    experiment_runs = models.ManyToManyField(
        ExperimentRun,
        related_name="jobs",
        blank=True,
    )

    runner = models.ForeignKey(
        Runner, related_name="jobs", null=True, blank=True, on_delete=models.CASCADE
    )

    is_running = models.BooleanField(default=False)
    is_finished = models.BooleanField(default=False)
    will_cancel = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.experiment.pk} - {self.created_at}"
