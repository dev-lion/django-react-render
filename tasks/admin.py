from django.contrib import admin
from .models import Task,StatusTask

# Register your models here.

admin.site.register(Task)
admin.site.register(StatusTask)

