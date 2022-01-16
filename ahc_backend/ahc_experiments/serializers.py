from rest_framework import serializers

from .models import Experiment, ExperimentRun, ExperimentMetric
from .custom_storage import LogStorage

log_storage_inst = LogStorage()


class ExperimentRunSerializer(serializers.ModelSerializer):
    logs = serializers.SerializerMethodField()

    def get_logs(self, obj: ExperimentRun):
        if not obj.log_path:
            return None

        file = log_storage_inst.open(obj.log_path, "r")
        content = file.read()
        file.close()
        return content

    class Meta:
        model = ExperimentRun
        fields = (
            "id",
            "sequence_id",
            "started_at",
            "finished_at",
            "exit_code",
            "log_path",
            "logs",
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
            "logs",
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
