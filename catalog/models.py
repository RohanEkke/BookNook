from django.db import models
from django.conf import settings

class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=255)

    author = models.CharField(max_length=255)

    genre = models.ManyToManyField(
        Genre,
        related_name='books'
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(default=0)

    image = models.ImageField(
        upload_to='books/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

@property
def image_url(self):
    if not self.image:
        return None

    filename = self.image.name.split("/")[-1]

    return (
        f"{settings.SUPABASE_URL}/storage/v1/object/public/"
        f"book-images/{filename}"
    )

