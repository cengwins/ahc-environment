from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
)

from rest_framework.serializers import Serializer

from ahc_repositories.permissions import RepositoryAccessPermission
from ahc_repositories.models import Repository

from .serializers import ExperimentSerializer, ExperimentRunSerializer
from .models import Experiment, ExperimentRun


class ListCreateExperimentsAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer

    def perform_create(self, serializer: Serializer) -> None:
        repository_id = self.kwargs["repository_id"]

        serializer.validated_data["repository"] = Repository.objects.get(
            pk=repository_id
        )

        experiment: Experiment = serializer.save()
        experiment.creator = self.request.user
        experiment.save()

        experiment.refresh_from_db()

    def get_queryset(self):
        return super().get_queryset().filter(repository=self.kwargs["repository_id"])


class RetrieveExperimentAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer
    lookup_url_kwarg = "experiment_id"

    def get_queryset(self):
        return super().get_queryset().filter(repository=self.kwargs["repository_id"])


class ListExperimentRunsAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = ExperimentRun.objects.all()
    serializer_class = ExperimentRunSerializer

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                experiment=self.kwargs["experiment_id"],
                experiment__repository=self.kwargs["repository_id"],
            )
        )


class RetrieveExperimentRunsAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, RepositoryAccessPermission)
    queryset = ExperimentRun.objects.all()
    serializer_class = ExperimentRunSerializer
    lookup_url_kwarg = "experiment_run_id"

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                experiment=self.kwargs["experiment_id"],
                experiment__repository=self.kwargs["repository_id"],
            )
        )
