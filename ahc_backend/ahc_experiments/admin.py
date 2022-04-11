from django.contrib import admin

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin
import nested_admin


class ExperimentRunTabularInline(nested_admin.NestedTabularInline):
    model = ExperimentRun
    extra = 0


class ExperimentRunStackedInline(nested_admin.NestedStackedInline):
    model = ExperimentRun
    readonly_fields = (
        "get_log_content",
        "sequence_id",
        "exit_code",
    )
    fieldsets = (
        (
            None,
            {
                "fields": (("sequence_id", "exit_code"), ("finished_at", "started_at")),
            },
        ),
        (None, {"classes": ("collapse", "wide"), "fields": ("get_log_content",)}),
    )
    extra = 0


class ExperimentResource(resources.ModelResource):
    class Meta:
        model = Experiment


class ExperimentAdmin(ImportExportModelAdmin, nested_admin.NestedModelAdmin):
    resource_class = ExperimentResource
    inlines = [ExperimentRunStackedInline]
    list_display = [
        "_repo_owner_username",
        "_repo_name",
        "status",
        "sequence_id",
        "commit",
    ]

    fields = [
        "repository",
        "status",
        "sequence_id",
        "commit",
        "reference",
        "reference_type",
    ]

    readonly_fields = [
        "status",
    ]


class ExperimentRunResource(resources.ModelResource):
    class Meta:
        model = ExperimentRun


class ExperimentRunAdmin(ImportExportModelAdmin):
    resource_class = ExperimentRunResource


class ExperimentMetricResource(resources.ModelResource):
    class Meta:
        model = ExperimentMetric


class ExperimentMetricAdmin(ImportExportModelAdmin):
    resource_class = ExperimentMetricResource


admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(ExperimentRun, ExperimentRunAdmin)
