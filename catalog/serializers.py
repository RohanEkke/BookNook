from .models import Book
from rest_framework import serializers


class BookSerializer(serializers.ModelSerializer):
    genre = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="name"
    )
    class Meta:
        model = Book
        fields = ["id", "title", "author", "description", "price", "stock", "genre", "image"]
