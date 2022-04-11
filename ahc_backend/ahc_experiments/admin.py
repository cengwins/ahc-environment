from django.contrib import admin

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class ExperimentResource(resources.ModelResource):
    class Meta:
        model = Experiment


class ExperimentAdmin(ImportExportModelAdmin):
    resource_class = ExperimentResource


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
