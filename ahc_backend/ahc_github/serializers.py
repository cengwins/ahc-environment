from rest_framework import serializers
from .models import GithubProfile
from github import AuthenticatedUser, Github, PaginatedList, Repository, Branch


class RepositorySerializer(serializers.Serializer):
    id = serializers.CharField(max_length=100)
    name = serializers.StringRelatedField()
    full_name = serializers.CharField(max_length=100)
    private = serializers.BooleanField()
    description = serializers.StringRelatedField()
    default_branch = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField()
    html_url = serializers.StringRelatedField()
    url = serializers.StringRelatedField() #this is the github api url of the repository.

