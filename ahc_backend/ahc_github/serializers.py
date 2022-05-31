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


class GithubCreateUpdateContentSerializer(serializers.Serializer):
    """
    Serializer used for yml commit requests from frontend.

    Analogous to GitHub's Content API's request schema. However, content is not base64
    encoded.

    Fields:
        message: commit message, required.
        content: new file content, required.
        sha: Blob SHA of the file being replaced, required for updates, omitted for
        creates.
        branch: upstream branch, default branch if not provided.

    See:
    https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
    """

    # No validation here.
    message = serializers.CharField()

    # New content of the file. Can be blank
    content = serializers.CharField(allow_blank=True)

    # No validation here.
    sha = serializers.CharField(required=False)

    # Upstream default branch is used if unspecified.
    branch = serializers.CharField(required=False)
