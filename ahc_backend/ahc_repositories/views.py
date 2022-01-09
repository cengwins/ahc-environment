from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView, Response

from ahc_utils.helpers import unauthorized
from .models import Repository, RepositoryUser
from .serializers import RepositorySerializer, RepositoryUserSerializer
from django.contrib.auth.models import User


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

    def delete(self, request, *args, **kwargs):
        repo_id = kwargs.get("id", None)
        allowed = False
        for rep_user in request.user.repository_users.all():
            if rep_user.repository.pk == repo_id:
                allowed = True
                break
        if allowed:
            try:
                repo = Repository.objects.get(pk=repo_id)
                repo.delete()
                return Response(
                    {
                        "success": True,
                    }
                )
            except Exception:
                return Response(
                    status=404, data={"detail": "No repository with given id"}
                )
        return unauthorized("Not allowed")


class AuthMembersOfRepositoryAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        repo_id = kwargs.get("id", None)
        try:
            repo = Repository.objects.get(pk=repo_id)
        except Exception:
            return Response(status=404, data={"detail": "No repository with given id"})

        serializer = RepositoryUserSerializer(repo.users.all(), many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        repo_id = kwargs.get("id")
        try:
            repo = Repository.objects.get(pk=repo_id)
        except Exception:
            return Response(status=404, data={"detail": "No repository with given id"})

        email = request.data.get("email", None)
        if email is None:
            return Response(status=403, data={"detail": "Email is not provided."})
        try:
            user = User.objects.get(email=email)
        except Exception:
            return Response(status=404, data={"detail": "No user with given email"})

        repo_users = user.repository_users.all()

        for repo_user in repo_users:
            if repo_user.repository == repo:
                return Response(
                    {
                        "detail": "This user already is one of the authorized members of this repository."
                    }
                )
        created_repo_user = RepositoryUser.objects.create(
            repository=repo, user=user, type="O"
        )
        return Response({"success": True, "id": created_repo_user.pk})


class AuthMemberOfRepositoryAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def delete(self, request, *args, **kwargs):
        repo_id = kwargs.get("id", None)
        member_id = kwargs.get("memberID", None)
        try:
            repo = Repository.objects.get(pk=repo_id)
            member = repo.users.get(pk=member_id)
            member.delete()
            return Response(
                {
                    "success": True,
                }
            )
        except Exception:
            return Response(
                status=404, data={"detail": "No repository or member with given ids"}
            )
