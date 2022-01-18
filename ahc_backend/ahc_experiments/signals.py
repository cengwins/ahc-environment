from django.db.models.signals import post_save
from django.dispatch import receiver


from .models import Experiment
from .tasks import run_experiment


@receiver(post_save, sender=Experiment)
def on_experiment_save(sender, instance: Experiment, created: bool, **kwargs):
    if created:
        run_experiment.apply_async(args=[instance.id], countdown=5)
