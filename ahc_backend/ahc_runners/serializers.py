from rest_framework import serializers

from .models import Runner


class RunnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Runner
        fields = ("name",)
