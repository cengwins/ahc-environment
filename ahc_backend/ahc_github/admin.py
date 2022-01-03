from django.contrib import admin

from .models import *

admin.site.register(GithubProfile)
admin.site.register(GithubRepositoryDeployToken)
