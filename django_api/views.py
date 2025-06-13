from django.views.generic import View
from django.http import HttpResponse
import os

class FrontendAppView(View):
    template_name = "frontend/index.html"
