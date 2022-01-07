from rest_framework.serializers import ModelSerializer, SerializerMethodField

from ahc_users.serializers import UserSerializer
from .models import Repository, RepositoryUser


class RepositorySerializer(ModelSerializer):
    class Meta:
        model = Repository
        fields = ("id", "slug", "name", "upstream", "upstream_type")
