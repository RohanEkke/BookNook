from .models import CartItem, Cart
from rest_framework import serializers



class CartItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_author = serializers.CharField(source="book.author", read_only=True)
    book_price = serializers.DecimalField(source="book.price", max_digits=10, decimal_places=2, read_only=True)
    book_image = serializers.ImageField(source="book.image", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "cart", "book", "book_title", "book_author", "book_price", "book_image", "quantity", "subtotal"]

    def get_subtotal(self, obj):
        return obj.book.price * obj.quantity



class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ["id", "items", "total"]

    def get_total(self, obj):
        return sum(
            item.book.price * item.quantity
            for item in obj.items.all()
        )