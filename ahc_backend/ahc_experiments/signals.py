import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


from .models import Experiment, ExperimentRun
from .tasks import fetch_commit_by_experiment_reference


@receiver(post_save, sender=Experiment)
def on_experiment_save(sender, instance: Experiment, created: bool, **kwargs):
    if created:
        ## TODO: remove later
        ## For now, let's create some mock run data for experiments

        for i in range(3):
            ExperimentRun.objects.create(
                experiment=instance,
                exit_code=-i,
                log_path="Hello, world!",
                started_at=timezone.now() - datetime.timedelta(days=2),
                finished_at=timezone.now() - datetime.timedelta(days=1),
            )

        fetch_commit_by_experiment_reference(instance.id)
