from django.urls import path

from . import views

app_name = 'homepage'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('profile', views.ProfileView.as_view(), name='profile'),
    path('tex', views.TexView.as_view(), name='tex'),
    path('hololive', views.HololiveView.as_view(), name='hololive'),
]
