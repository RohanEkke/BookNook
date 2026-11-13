
from .models import Book
from rest_framework import serializers
from django.conf import settings


class BookSerializer(serializers.ModelSerializer):
    genre = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="name"
    )

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if not obj.image:
            return None

        filename = obj.image.name.split("/")[-1]

        return (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"book-images/{filename}"
        )

    class Meta:
        model = Book
        fields = [
            "id", "title", "author", "description",
            "price", "stock", "genre", "image"
        ]
