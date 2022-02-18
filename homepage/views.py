from re import template
from django.views import generic


class IndexView(generic.TemplateView):
    template_name = 'index.html'

class ProfileView(generic.TemplateView):
    template_name = 'profile.html'

class TexView(generic.TemplateView):
    template_name = 'tex.html'

class HololiveView(generic.TemplateView):
    template_name = 'hololive.html'
