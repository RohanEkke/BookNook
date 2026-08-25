from django.contrib import admin
from .models import Genre, Book


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ["name"]

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "display_genres", "price", "stock"]
    def display_genres(self, obj):
        return ", ".join(
            genre.name for genre in obj.genre.all()
        )

    display_genres.short_description = "Genres"
    search_fields = ("title", "author", "genre__name")