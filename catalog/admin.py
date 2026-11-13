
from django.contrib import admin
from django.utils.html import format_html
from .models import Genre, Book
from django.conf import settings

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "author",
        "display_genres",
        "price",
        "stock",
        "display_image",
    ]

    search_fields = ("title", "author", "genre__name")

    def display_genres(self, obj):
        return ", ".join(
            genre.name for genre in obj.genre.all()
        )

    display_genres.short_description = "Genres"

    def display_image(self, obj):
        if not obj.image:
            return "No image"

        filename = obj.image.name.split("/")[-1]

        image_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"book-images/{filename}"
        )

        return format_html(
            '<a href="{}" target="_blank">View image</a>',
            image_url
        )

    display_image.short_description = "Book image"
