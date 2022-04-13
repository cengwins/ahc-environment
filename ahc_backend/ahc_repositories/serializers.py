from rest_framework import serializers
from ahc_users.serializers import UserSerializer

from .models import Repository, RepositoryUser


class RepositoryUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    type = serializers.ChoiceField(choices=RepositoryUser.RepositoryUserTypes.choices)

    class Meta:
        model = RepositoryUser
        fields = ("id", "user", "type")


class RepositorySerializer(serializers.ModelSerializer):
    upstream_type = serializers.ChoiceField(
        choices=Repository.RepositoryUpstreamTypes.choices
    )
    users = RepositoryUserSerializer(many=True, required=False, read_only=True)
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        return RepositoryUserSerializer(obj.owner).data

    class Meta:
        model = Repository
        fields = (
            "id",
            "slug",
            "description",
            "html_url",
            "stargazers_count",
            "private",
            "name",
            "upstream",
            "upstream_type",
            "users",
            "owner",
        )
        read_only_fields = ("slug",)
