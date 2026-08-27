from django.contrib import admin

# Register your models here.
from.models import Cart, CartItem

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "created_at", "updated_at"]
    search_fields = ["user__email"]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["id", "cart", "book", "quantity"]
    search_fields = ["cart__user__email", "book__title", "book__author"]