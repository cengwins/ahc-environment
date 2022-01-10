from django.contrib import admin

from .models import *

admin.site.register(Experiment)
admin.site.register(ExperimentRun)
admin.site.register(ExperimentMetric)
