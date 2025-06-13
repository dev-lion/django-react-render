from django.db import models

# se agrega este model para el estatus de las tareas / 24/04/25 / amolina
class StatusTask(models.Model):
    status = models.CharField(max_length=200)

    def __str__(self):
        return self.status


# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    status = models.ForeignKey(StatusTask, on_delete=models.CASCADE, null=True)
    def __str__(self):
        return self.title
    
    #20.46, ahi nos quedamos en el video

