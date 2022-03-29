from django.contrib import admin

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class GithubProfileResource(resources.ModelResource):
    class Meta:
        model = GithubProfile


class GithubProfileAdmin(ImportExportModelAdmin):
    resource_class = GithubProfileResource


class GithubRepositoryDeployTokenResource(resources.ModelResource):
    class Meta:
        model = GithubRepositoryDeployToken


class GithubRepositoryDeployTokenAdmin(ImportExportModelAdmin):
    resource_class = GithubRepositoryDeployTokenResource


admin.site.register(GithubProfile, GithubProfileAdmin)
admin.site.register(GithubRepositoryDeployToken, GithubRepositoryDeployTokenAdmin)
