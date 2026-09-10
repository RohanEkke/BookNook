from .models import Order, OrderItem
from rest_framework import serializers
from catalog.models import Book
from accounts.models import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields = ["id", "full_name", "phone", "address_type", "address_line_1", "address_line_2", "city", "state", "postal_code", "country", "is_default"]


class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_image = serializers.ImageField(source="book.image", read_only=True)

    class Meta:
        model=OrderItem
        fields = ["id", "book", "book_title", "book_image", "quantity", "price"]
        read_only_fields = ["id", "book_title", "price"]

class OrderSerializer(serializers.ModelSerializer):
    address = AddressSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model=Order
        fields = ["id", "user", "items", "address", "total_amount", "status", "payment_method", "payment_status", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "items", "total_amount", "status", "payment_status", "created_at", "updated_at"]


