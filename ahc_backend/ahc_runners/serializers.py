from rest_framework import serializers

from ahc_experiments.serializers import ExperimentWithRepositorySerializer

from .models import Runner, RunnerJob


class RunnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Runner
        fields = ("name",)


class RunnerJobSerializer(serializers.ModelSerializer):
    experiment = ExperimentWithRepositorySerializer()

    class Meta:
        model = RunnerJob
        fields = (
            "id",
            "experiment",
            "is_running",
            "is_finished",
            "will_cancel",
            "is_success",
        )
