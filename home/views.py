from django.http import HttpResponse
from django.shortcuts import render, redirect

from api.models import Url


def index(request):
    return render(request, "index.html")


def my_redirect(request, code):
    url = Url.objects.get(code=code)
    if url:
        return redirect(url.long_url, permanent=True)
    else:
        return redirect("/", permanent=True)
