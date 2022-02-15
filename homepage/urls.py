from django.urls import path

from . import views

app_name = 'homepage'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('tex', views.TexView.as_view(), name='tex'),
]
