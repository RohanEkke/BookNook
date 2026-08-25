from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import BookSerializer
from rest_framework.response import Response
from .models import Book
from rest_framework import status
from django.http import Http404
# Create your views here.


class BookView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookDetailsView(APIView):
    def get_object(self, id):
        try:
            return Book.objects.get(id=id)
        except Book.DoesNotExist:
            raise Http404

    def get(self, request, id):
        book = self.get_object(id)
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)