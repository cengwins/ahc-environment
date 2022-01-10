from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ahc_users.serializers import UserSerializer

from .models import Repository, RepositoryUser


class RepositorySerializer(ModelSerializer):
    class Meta:
        model = Repository
        fields = ("id", "slug", "name", "upstream", "upstream_type")


class RepositoryUserSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    type = SerializerMethodField()

    class Meta:
        model = RepositoryUser
        fields = ("id", "user", "type")

    def get_type(self, obj):
        return obj.get_type_display()
