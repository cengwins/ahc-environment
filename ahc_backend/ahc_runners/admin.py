from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources

from .models import *

admin.site.register(Runner)


class RunnerJobResource(resources.ModelResource):
    class Meta:
        model = RunnerJob


@admin.action(description="Mark selected jobs for cancellation.")
def mark_job_for_cancellation(_modeladmin, _request, queryset):
    return queryset.update(will_cancel=True)


class RunnerJobAdmin(ImportExportModelAdmin):
    resource_class = RunnerJobResource
    readonly_fields = ["experiment", "is_running", "is_finished", "runner"]
    list_display = [
        "id",
        "experiment",
        "runner",
        "is_running",
        "is_finished",
        "will_cancel",
    ]
    actions = [mark_job_for_cancellation]


admin.site.register(RunnerJob, RunnerJobAdmin)
