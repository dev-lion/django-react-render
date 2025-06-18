import os
import threading
import yt_dlp
import json
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from urllib.parse import quote
import uuid
import time

from rest_framework import viewsets
from .serializer import TaskSerializer, StatusTaskSerializer
from .models import Task, StatusTask

from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status


from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def set_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

# tasks/views.py
from django.views.generic import TemplateView

class FrontendAppView(TemplateView):
    template_name = "index.html"


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class StatusTasklistView(viewsets.ModelViewSet):
    serializer_class = StatusTaskSerializer
    queryset = StatusTask.objects.all()


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'El nombre de usuario y la contraseña son obligatorios'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'id': user.id, 'username': user.username}, status=status.HTTP_201_CREATED)
        

download_progress = {}
download_results = {}

def my_hook(d):
    video_id = d.get('info_dict', {}).get('id', 'unknown')
    status = d.get('status')
    if status == 'downloading':
        percent = d.get('_percent_str', '').strip()
        download_progress[video_id] = percent
    elif status == 'finished':
        download_progress[video_id] = '100% (descarga completa)'

@csrf_exempt
def download_audio(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            url = data.get('url')
            if not url:
                return JsonResponse({'error': 'No se proporcionó una URL'}, status=400)

            download_id = str(uuid.uuid4())
            # Agregamos flag finished
            download_results[download_id] = {
                'progress': '0%', 
                'filepath': None,
                'finished': False
            }

            def download_thread():
                output_dir = os.path.join(settings.MEDIA_ROOT, 'downloads')
                os.makedirs(output_dir, exist_ok=True)

                def progress_hook(d):
                    # Actualizar progreso sin perder filepath
                    if d.get('status') == 'downloading':
                        download_results[download_id]['progress'] = d.get('_percent_str', '').strip()
                    elif d.get('status') == 'finished':
                        download_results[download_id]['progress'] = '100%'

                ydl_opts = {
                    'format': 'bestaudio/best',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'flac',
                        'preferredquality': '0',
                    }],
                    'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
                    'progress_hooks': [progress_hook],
                    'http_headers': {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
                    }
                }

                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    filename = ydl.prepare_filename(info)
                    flac_filename = filename.rsplit('.', 1)[0] + '.flac'

                    # Esperar hasta que el archivo exista (max 10 seg)
                    for _ in range(20):
                        if os.path.exists(flac_filename):
                            break
                        time.sleep(0.5)

                    if os.path.exists(flac_filename):
                        download_results[download_id]['progress'] = '100%'
                        download_results[download_id]['filepath'] = flac_filename
                        download_results[download_id]['finished'] = True
                    else:
                        download_results[download_id]['progress'] = 'Error: archivo no encontrado'
                        download_results[download_id]['filepath'] = None
                        download_results[download_id]['finished'] = False

            threading.Thread(target=download_thread).start()
            return JsonResponse({'download_id': download_id})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def get_progress(request):
    download_id = request.GET.get('download_id')
    if not download_id:
        return JsonResponse({'error': 'No se proporcionó download_id'}, status=400)

    result = download_results.get(download_id)
    if not result:
        return JsonResponse({'error': 'ID no válido'}, status=404)

    return JsonResponse({'progress': result['progress']})


@csrf_exempt
def get_file(request):
    download_id = request.GET.get('download_id')
    result = download_results.get(download_id)

    # Validar que exista resultado, archivo y que descarga esté finalizada
    if not result:
        return JsonResponse({'error': 'ID no válido'}, status=404)

    if not result['finished']:
        return JsonResponse({'error': 'Archivo aún no listo'}, status=404)

    if not result['filepath'] or not os.path.exists(result['filepath']):
        return JsonResponse({'error': 'Archivo no disponible'}, status=404)

    file_path = result['filepath']
    file_name = os.path.basename(file_path)

    print("aqui imprime el valor name")
    print(file_name)

    encoded_filename = quote(file_name)
    print("📦 Enviando archivo:", file_name)

    response = FileResponse(open(file_path, 'rb'), content_type='audio/flac')
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = (
        f'attachment; filename="{file_name}"; filename*=UTF-8\'\'{encoded_filename}'
    )
    return response









