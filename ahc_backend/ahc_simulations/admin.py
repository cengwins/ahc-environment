from django.contrib import admin

from .models import *

admin.site.register(Simulation)
admin.site.register(SimulationRun)
admin.site.register(SimulationRunMetric)
