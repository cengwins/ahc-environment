from django.contrib import admin
import nested_admin
from ahc_experiments.models import Experiment, ExperimentRun
from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class ExperimentRunInline(nested_admin.NestedTabularInline):
    model = ExperimentRun
    extra = 0


class ExperimentInline(nested_admin.NestedTabularInline):
    model = Experiment
    extra = 0
    inlines = [ExperimentRunInline]


class AHCRepositoryResource(resources.ModelResource):
    class Meta:
        model = Repository


class AHCRepositoryAdmin(ImportExportModelAdmin, nested_admin.NestedModelAdmin):
    resource_class = AHCRepositoryResource
    list_display = (
        "name",
        "description",
        "private",
        "html_url",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at", "private")
    search_fields = ("name", "description", "html_url")
    inlines = [ExperimentInline]


class AHCRepositoryUserResource(resources.ModelResource):
    class Meta:
        model = RepositoryUser


class AHCRepositoryUserAdmin(ImportExportModelAdmin):
    resource_class = AHCRepositoryUserResource
    list_display = ("user", "repository", "created_at", "updated_at", "type")
    list_filter = ("created_at", "updated_at", "user")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "repository__name",
    )


class AHCRepositoryEnvVariableResource(resources.ModelResource):
    class Meta:
        model = RepositoryEnvVariable


class AHCRepositoryEnvVariableAdmin(ImportExportModelAdmin):
    resource_class = AHCRepositoryEnvVariableResource
    list_display = (
        "name",
        "repository",
        "added_by",
        "value",
        "is_active",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at", "is_active", "added_by")
    search_fields = (
        "repository__name",
        "added_by__username",
        "added_by__first_name",
        "added_by__last_name",
        "added_by__email",
    )


admin.site.register(Repository, AHCRepositoryAdmin)
admin.site.register(RepositoryUser, AHCRepositoryUserAdmin)
admin.site.register(RepositoryEnvVariable, AHCRepositoryEnvVariableAdmin)
