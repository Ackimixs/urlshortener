from django.urls import path, include
from . import views

urlpatterns = [
    path('url', views.url_func),
    path('url/<int:pk>', views.url_func_id),
]
