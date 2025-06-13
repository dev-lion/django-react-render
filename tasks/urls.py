from .views import RegisterView

from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from tasks import views
#api versioning

from .views import download_audio # para audio
from .views import get_progress
from .views import get_file

# JWT views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'tasks', views.TaskView, 'tasks')
router.register(r'status-task', views.StatusTasklistView, 'status-task')


urlpatterns = [
    path("api/v1/", include(router.urls)),  # queda /tasks/v1/...
    path('docs/', include_docs_urls(title="Tasks API")),

    path('download/', download_audio, name='download_audio'),  # queda /tasks/download/
    path('progress/', get_progress, name='get_progress'),      # queda /tasks/progress/
    path('file/', get_file),                                   # queda /tasks/file/

    # JWT views
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),      # queda /tasks/token/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),     # queda /tasks/token/refresh/
    path('register/', RegisterView.as_view(), name='register'),                   # queda /tasks/register/
]


'''
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', include_docs_urls(title="Tasks API")),
    path('api/download/', download_audio, name='download_audio'),
    path('api/progress/', get_progress, name='get_progress'),
    path('api/file/', get_file),

    # Rutas para autenticación JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/register/', RegisterView.as_view(), name='register'),
]

'''
