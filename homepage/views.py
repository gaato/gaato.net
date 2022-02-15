from django.views import generic


class IndexView(generic.TemplateView):
    template_name = "index.html"

class TexView(generic.TemplateView):
    template_name = "tex.html"
