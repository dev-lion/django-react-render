from django.views.generic import View
from django.http import HttpResponse, FileResponse, HttpResponseNotFound
from django.views.generic import TemplateView
import os

class FrontendAppView(View):
    def get(self, request):
        try:
            file_path = os.path.join(os.path.dirname(__file__), 'frontend/static/index.html')
            return FileResponse(open(file_path, 'rb'))
        except FileNotFoundError:
            return HttpResponseNotFound("index.html not found. Did you build the frontend?")

