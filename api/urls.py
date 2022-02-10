from django.urls import path

from . import views

app_name = 'api'
urlpatterns = [
    path('tex', views.TexView.as_view(), name='tex'),
]
