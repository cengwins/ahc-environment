from django.contrib import admin

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class AHCRepositoryResource(resources.ModelResource):
    class Meta:
        model = Repository


class AHCRepositoryAdmin(ImportExportModelAdmin):
    resource_class = AHCRepositoryResource
    list_display = ('name', 'description', 'url', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name', 'description', 'url')


class AHCRepositoryUserResource(resources.ModelResource):
    class Meta:
        model = RepositoryUser


class AHCRepositoryUserAdmin(ImportExportModelAdmin):
    resource_class = AHCRepositoryUserResource
    list_display = ('user', 'repository', 'created_at', 'updated_at', 'type')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user', 'repository')


class AHCRepositoryEnvVariableResource(resources.ModelResource):
    class Meta:
        model = RepositoryEnvVariable


class AHCRepositoryEnvVariableAdmin(ImportExportModelAdmin):
    resource_class = AHCRepositoryEnvVariableResource
    list_display = ('repository', 'key', 'value', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('repository', 'key', 'value')


admin.site.register(Repository, AHCRepositoryAdmin)
admin.site.register(RepositoryUser, AHCRepositoryUserAdmin)
admin.site.register(RepositoryEnvVariable, AHCRepositoryEnvVariableAdmin)
