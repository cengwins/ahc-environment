from rest_framework import serializers
from ahc_users.serializers import UserSerializer

from .models import Repository, RepositoryUser


class RepositorySerializer(serializers.ModelSerializer):
    upstream_type = serializers.ChoiceField(
        choices=Repository.RepositoryUpstreamTypes.choices
    )

    class Meta:
        model = Repository
        fields = ("id", "slug", "name", "upstream", "upstream_type")


class RepositoryUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    type = serializers.ChoiceField(choices=RepositoryUser.RepositoryUserTypes.choices)

    class Meta:
        model = RepositoryUser
        fields = ("id", "user", "type")
