from django.views.generic import View
from django.http import HttpResponse, FileResponse, HttpResponseNotFound
from django.views.generic import TemplateView
import os

@ensure_csrf_cookie
def set_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


class FrontendAppView(TemplateView):
    template_name = "index.html"