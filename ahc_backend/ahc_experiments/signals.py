from django.db.models.signals import post_save
from django.dispatch import receiver


from .models import Experiment
from .tasks import fetch_commit_by_experiment_reference


@receiver(post_save, sender=Experiment)
def on_experiment_save(sender, instance: Experiment, created: bool, **kwargs):
    if created:
        print(instance)
        fetch_commit_by_experiment_reference(instance.id)
