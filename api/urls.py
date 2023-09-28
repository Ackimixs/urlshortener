from django.urls import path, include
from .views import (
    UrlListApiView,
)

urlpatterns = [
    path('url', UrlListApiView.as_view()),
]
