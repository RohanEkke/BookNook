from django.db import models
from django.conf import settings
from catalog.models import Book

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="cart"
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, 
        on_delete=models.CASCADE,
        related_name="items"
        )

    book = models.ForeignKey(
        Book, 
        on_delete=models.CASCADE,
        related_name="cart_items"
        )

    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "book"],
                name="unique_cart_book"
            )
        ]

    def __str__(self):
        return f"{self.book.title} x {self.quantity}"