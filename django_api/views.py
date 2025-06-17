from django.views.generic import View
from django.http import HttpResponse
from django.views.generic import TemplateView
import os

class FrontendAppView(TemplateView):
    template_name = 'index.html'
