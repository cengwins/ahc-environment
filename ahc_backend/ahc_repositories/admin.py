from django.contrib import admin

from .models import *

admin.site.register(Repository)
admin.site.register(RepositoryUser)
admin.site.register(RepositoryEnvVariable)
