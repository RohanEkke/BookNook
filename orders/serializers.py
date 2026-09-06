from .models import Order, OrderItem
from rest_framework import serializers
from catalog.models import Book
from accounts.models import Address


class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)

    class Meta:
        model=OrderItem
        fields = ["id", "book", "book_title", "quantity", "price"]
        read_only_fields = ["id", "book_title", "price"]

class OrderSerializer(serializers.ModelSerializer):
    address_id = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), source="address")
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model=Order
        fields = ["id", "user", "items", "address_id", "total_amount", "status", "payment_method", "payment_status", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "items", "total_amount", "status", "payment_status", "created_at", "updated_at"]


class PlaceOrderSerializer(serializers.Serializer):

    selectedAddress = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all())

    paymentMethod = serializers.ChoiceField(Order.PAYMENT_METHOD)

    def validate_selectedAddress(self, address):
        user = self.context["request"].user

        if address.user != user:
            raise serializers.ValidationError("You cannot use this address")
        return address

    def validate(self, attrs):
        user = self.context["requst"].user

        cart = getattr(user, "cart", None)

        if not cart:
            raise serializers.ValidationError("Your cart is empty")

        if not cart.items.exists():
            raise serializers.ValidationError("your cart is empty")
        
        return attrs