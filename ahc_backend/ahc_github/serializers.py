from rest_framework import serializers

from .models import GithubProfile


class GithubProfileSerializer(serializers.ModelSerializer):
    access_token = serializers.CharField(max_length=150, write_only=True)

    class Meta:
        model = GithubProfile
        fields = ("access_token",)


class GithubRepositorySerializer(serializers.Serializer):
    id = serializers.CharField(max_length=100)

    name = serializers.CharField()
    full_name = serializers.CharField(max_length=100)

    private = serializers.BooleanField()

    html_url = serializers.CharField()

    description = serializers.CharField()

    stargazers_count = serializers.IntegerField()

    class Meta:
        fields = "__all__"


class GithubRepositoryBranchSerializer(serializers.Serializer):
    name = serializers.CharField()

    class Meta:
        fields = "__all__"
