from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Url
from api.serializers import UrlSerializer


@api_view(['GET', 'POST'])
def url_func(request):
    if request.method == 'GET':
        url = Url.objects.all()
        serializer = UrlSerializer(url, many=True)
        d = {"body": {"url": serializer.data}}
        return Response(d)
    elif request.method == 'POST':
        serializer = UrlSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        d = {"body": {"url": serializer.data}}
        return Response(d)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def url_func_id(request, pk):
    if request.method == 'GET':
        url = Url.objects.get(id=pk)
        serializer = UrlSerializer(url, many=False)
        d = {"body": {"url": serializer.data}}
        return Response(d)

    elif request.method == 'PUT' or request.method == 'PATCH':
        url = Url.objects.get(id=pk)
        serializer = UrlSerializer(instance=url, data=request.data)
        if serializer.is_valid():
            serializer.save()
        d = {"body": {"url": serializer.data}}
        return Response(d)
    elif request.method == 'DELETE':
        url = Url.objects.get(id=pk)
        url.delete()
        serializer = UrlSerializer(url, many=False)
        d = {"body": {"url": serializer.data}}
        return Response(d)
