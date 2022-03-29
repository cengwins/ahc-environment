import uuid

from django.db import models

from ahc_experiments.models import Experiment


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

    runner = models.ForeignKey(
        Runner, related_name="jobs", null=True, blank=True, on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.experiment.pk} - {self.created_at}"
