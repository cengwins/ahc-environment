from celery import shared_task

from .models import Experiment

from ahc_runners.models import RunnerJob


@shared_task()
def run_experiment(experiment_id: int):
    experiment: Experiment = Experiment.objects.get(id=experiment_id)
    if not experiment.commit:
        experiment.fetch_commit_from_reference()

    job = RunnerJob.ranked_objects.create(
        experiment=experiment, creator=experiment.creator
    )
    job.save()
