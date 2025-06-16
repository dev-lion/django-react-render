from django.views.generic import View
from django.http import HttpResponse
import os

class FrontendAppView(View):
    def get(self, request):
        file_path = os.path.join(os.path.dirname(__file__), 'frontend/static/index.html')
        return FileResponse(open(file_path, 'rb'))
