from rest_framework import serializers

from ahc_repositories.serializers import RepositorySerializer
from ahc_utils.helpers import BasicException


from .models import Experiment, ExperimentRun, ExperimentMetric
from .custom_storage import LogStorage

log_storage_inst = LogStorage()


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
            "log_url",
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
            "log_url",
            "created_at",
            "updated_at",
        )


class ExperimentSerializer(serializers.ModelSerializer):
    rank = serializers.SerializerMethodField()
    temp_logs = serializers.SerializerMethodField()

    reference_type = serializers.ChoiceField(
        choices=Experiment.ExperimentReferenceTypes.choices
    )
    runs = ExperimentRunSerializer(many=True, required=False, read_only=True)

    def get_rank(self, obj: Experiment):
        return obj._rank()

    def get_temp_logs(self, obj: Experiment):
        return obj._temp_logs()

    class Meta:
        model = Experiment
        fields = (
            "id",
            "sequence_id",
            "commit",
            "reference",
            "reference_type",
            "status",
            "rank",
            "temp_logs",
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


class ExperimentWithRepositorySerializer(serializers.ModelSerializer):
    reference_type = serializers.ChoiceField(
        choices=Experiment.ExperimentReferenceTypes.choices
    )
    repository = RepositorySerializer(required=False, read_only=True)

    class Meta:
        model = Experiment
        fields = (
            "id",
            "sequence_id",
            "commit",
            "reference",
            "reference_type",
            "status",
            "repository",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("sequence_id", "commit")
