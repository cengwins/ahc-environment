import re

from django.core.validators import RegexValidator
from django.db import models

from ahc_repositories.models import Repository


class Simulation(models.Model):
    """
    Model representing a simulation setup.
    """

    REFERENCE_TYPES = [
        ("T", "Tag"),
        ("C", "Commit"),
        ("B", "Branch"),
    ]

    repository = models.ForeignKey(
        Repository, related_name="simulations", on_delete=models.CASCADE
    )
    # For each repository, subsequent simulations' sequence_id are incremented by one.
    sequence_id = models.PositiveIntegerField()
    # Git commits are exactly 40-digit hexadecimal values
    commit = models.CharField(
        validators=[RegexValidator(regex=re.compile("^[0-9a-zA-Z]{40}$"))],
        max_length=40,
    )
    reference = models.CharField(max_length=80)
    reference_type = models.CharField(max_length=1, choices=REFERENCE_TYPES)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                Simulation.objects.filter(repository=self.repository)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                or 0
            ) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.repository.name} - Simulation #{self.sequence_id}"


class SimulationRun(models.Model):
    """
    Statistics of a simulation run.
    """

    simulation = models.ForeignKey(
        Simulation, related_name="runs", on_delete=models.CASCADE
    )
    sequence_id = models.PositiveIntegerField()

    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    exit_code = models.PositiveIntegerField(null=True, blank=True)
    log_path = models.CharField(max_length=4096, null=True, blank=True)  # PATH_MAX

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                SimulationRun.objects.filter(simulation=self.simulation)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                or 0
            ) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Simulation {self.simulation.id} - Run #{self.sequence_id}"


class SimulationRunMetric(models.Model):
    """
    Model for metrics of a simulation run.
    """

    SIMULATION_RUN_METRIC_TYPES = [("S", "System"), ("U", "User")]

    simulation_run = models.ForeignKey(
        SimulationRun, related_name="metrics", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=40)
    type = models.CharField(max_length=1, choices=SIMULATION_RUN_METRIC_TYPES)

    value_float = models.FloatField(null=True, blank=True)
    value_int = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"SimulationRun {self.simulation_run.id} - {self.name}"


"""
(DK): My understanding is that there is a one-to-many relation between metrics and
their aliases. If this is the case alias model and the schema should reflect this.
Also, It is not very clear to me what updated_at field signifies.

This one will be implemented later (2021-28-12)
"""

# class SimulationRunMetricAlias(models.Model):
#     """Aliases for simulation metrics.
#
#     Attributes:
#         id: int
#         simulation_run: int (simulation one-to-many)
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


# class SimulationActivityLog(models.Model):
#     """TODO: describe me.
#
#     Attributes:
#         user: int (user one-to-many)?
#         simulation: int (simulation ?-to-?)
#         type: string
#         target: string
#         created_at: datetime
#         updated_at: datetime
#     """
#     user = models.ForeignKey(ahc_users.models.User)
#     simulation = models.ForeignKey(Simulation)
#
