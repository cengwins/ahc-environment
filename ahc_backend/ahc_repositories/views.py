from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView, Response

from ahc_utils.helpers import unauthorized
from .models import Repository
from .serializers import RepositorySerializer


class GetRepositoriesAPIView(ListAPIView):
    permission_classes = [
        IsAuthenticated,
    ]
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    def get_queryset(self):
        return super().get_queryset().filter(users__user=self.request.user)


class GetOrDeleteRepositoryAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        repo_id = kwargs.get("id", None)
        allowed = False
        for rep_user in request.user.repository_users.all():
            if rep_user.repository.pk == repo_id:
                allowed = True
                break
        if allowed:
            try:
                repo = Repository.objects.get(pk=repo_id)
                return Response(RepositorySerializer(repo).data)
            except Exception:
                return Response(
                    status=404, data={"detail": "No repository with given id"}
                )
        return unauthorized("Not allowed")
