from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources

from .models import *

admin.site.register(Runner)


class RunnerJobResource(resources.ModelResource):
    class Meta:
        model = RunnerJob


@admin.action(description="Mark selected jobs for cancellation")
def mark_job_for_cancellation(_modeladmin, _request, queryset):
    return queryset.update(will_cancel=True)


@admin.action(description="Increase priority of jobs")
def increase_priority(_modeladmin, _request, queryset):
    for item in queryset:
        item.priority += 1
        item.save()


@admin.action(description="Decrease priority of jobs")
def decrease_priority(_modeladmin, _request, queryset):
    for item in queryset:
        item.priority = max(0, item.priority - 1)
        item.save()


class RunnerJobAdmin(ImportExportModelAdmin):
    resource_class = RunnerJobResource
    readonly_fields = [
        "experiment",
        "is_running",
        "is_finished",
        "is_success",
        "runner",
    ]
    list_display = [
        "id",
        "experiment",
        "_priority",
        "_rank",
        "runner",
        "is_running",
        "is_finished",
        "is_success",
        "will_cancel",
    ]
    actions = [mark_job_for_cancellation, increase_priority, decrease_priority]


admin.site.register(RunnerJob, RunnerJobAdmin)
