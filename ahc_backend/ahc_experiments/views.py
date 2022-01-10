from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListCreateAPIView

from rest_framework.serializers import Serializer

from ahc_repositories.permissions import RepositoryAccessPermission
from ahc_repositories.models import Repository

from .serializers import ExperimentSerializer
from .models import Experiment


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

        experiment.refresh_from_db()

    def get_queryset(self):
        return super().get_queryset().filter(repository=self.kwargs["repository_id"])
