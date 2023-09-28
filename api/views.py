from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Url
from .serializers import UrlSerializer


class UrlListApiView(APIView):
    # add permission to check if user is authenticated
    permission_classes = [permissions.AllowAny]

    # 1. List all
    def get(self, request, *args, **kwargs):
        urls = Url.objects
        serializer = UrlSerializer(urls, many=True)
        d = {"body": {"url": serializer.data}}
        return Response(d, status=status.HTTP_200_OK)

    # 2. Create
    def post(self, request, *args, **kwargs):
        data = {
            'code': request.data.get('code'),
            'long_url': request.data.get('long_url'),
        }
        print(data)
        serializer = UrlSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            d = {"body": {"url": serializer.data}}
            return Response(d, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
