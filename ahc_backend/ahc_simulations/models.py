import re

from django.core.validators import RegexValidator
from django.db import models

from ahc_backend.ahc_repositories.models import Repository


class Simulation(models.Model):
    """
    Model representing a simulation setup.
    """

    REFERENCE_TYPES = [
        ("T", "Tag"),
        ("C", "Commit"),
        ("B", "Branch"),
    ]

    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)
    # For each repository, subsequent simulations' sequence_id are incremented by one.
    sequence_id = models.PositiveIntegerField()
    # Git commits are exactly 40-digit hexadecimal values
    commit = models.CharField(
        validators=[RegexValidator(regex=re.compile("^[0-9a-zA-Z]{40}$"))]
    )
    reference = models.CharField(max_length=80)
    reference_type = models.CharField(max_length=1, choices=REFERENCE_TYPES)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                Simulation.objects.filter(repository=self.repository)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                + 1
            )
        super().save(*args, **kwargs)


class SimulationRun(models.Model):
    """
    Statistics of a simulation run.
    """

    simulation = models.ForeignKey(Simulation, on_delete=models.CASCADE)
    sequence_id = models.PositiveIntegerField()
    started_at = models.DateTimeField(null=True)
    finished_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)
    exit_code = models.PositiveIntegerField()
    log_path = models.CharField(max_length=4096)  # PATH_MAX

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                SimulationRun.objects.filter(simulation=self.simulation)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                + 1
            )
        super().save(*args, **kwargs)


"""
(DK): value_float and value_int. Can we leverage Python's ducktyping here to keep 
value_float and value_int in a single field? Python's typing module allows this with 
union types (Union[FLOAT_FIELD, INT_FIELD]). Can Django do the necessary adjustments 
to implement union types in the database side? Checking the type of each metric and 
having two fields for it is both cumbersome and error prone.

If there is no simple solution to that we can leave this as it is and consider 
refactoring it in the future after weighing the pros and the cons. It can get quite 
complicated and require some research beforehand.
"""


class SimulationRunMetric(models.Model):
    """
    Model for metrics of a simulation run.
    """

    simulation_run = models.ForeignKey(SimulationRun, on_delete=models.CASCADE)
    sequence_id = models.PositiveIntegerField()
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)
    type = models.CharField(choices=[("S", "System"), ("U", "User")], max_length=1)
    value_float = models.FloatField(null=True)
    value_int = models.IntegerField(null=True)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.sequence_id = (
                SimulationRunMetric.objects.filter(simulation=self.simulation_run)
                .aggregate(max_id=models.Max("sequence_id"))
                .get("max_id", 0)
                + 1
            )
        super().save(*args, **kwargs)

    pass  # TODO: fill me with fields.


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
