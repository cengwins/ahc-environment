from rest_framework import serializers

from .models import Experiment, ExperimentRun, ExperimentMetric


class ExperimentRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentRun
        fields = (
            "id",
            "sequence_id",
            "started_at",
            "finished_at",
            "exit_code",
            "log_path",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "sequence_id",
            "started_at",
            "finished_at",
            "exit_code",
            "log_path",
            "created_at",
            "updated_at",
        )


class ExperimentSerializer(serializers.ModelSerializer):
    reference_type = serializers.ChoiceField(
        choices=Experiment.ExperimentReferenceTypes.choices
    )
    runs = ExperimentRunSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Experiment
        fields = (
            "id",
            "sequence_id",
            "commit",
            "reference",
            "reference_type",
            "created_at",
            "updated_at",
            "runs",
        )
        read_only_fields = ("sequence_id", "commit")


class ExperimentMetricSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(
        choices=ExperimentMetric.ExperimentMetricTypes.choices
    )

    class Meta:
        model = ExperimentMetric
        fields = (
            "id",
            "name",
            "type",
            "value_float",
            "value_int",
            "created_at",
            "updated_at",
        )
        read_only_fields = "__all__"
