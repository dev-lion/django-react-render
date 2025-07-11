"""
URL configuration for django_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from tasks.views import FrontendAppView  # o donde esté definida esa vista
from .views import set_csrf_token


urlpatterns = [
    path('admin/', admin.site.urls),
    path('tasks/', include('tasks.urls')),
    path('', FrontendAppView.as_view(), name='frontend'),
    re_path(r'^.*$', FrontendAppView.as_view(), name='frontend'),
    #re_path(r"^.*$", FrontendAppView.as_view()),  # todas las demás rutas van a React
    path('csrf/', set_csrf_token),
]+ static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])