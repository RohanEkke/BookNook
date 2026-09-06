from django.db import models
from accounts.models import User, Address
from catalog.models import Book

# Create your models here.
class Order(models.Model):
    ORDER_STATUS = [
        ("pending", "PENDING"),
        ("confirmed", "CONFIRMED"),
        ("processing", "PROCESSING"),
        ("shipped", "SHIPPED"),
        ("out_of_delivery", "OUT FOR DELIVERY"),
        ("delivered", "DELIVERED"),
        ("cancelled", "CANCELLED"),
    ]

    PAYMENT_STATUS = [
        ("pending", "PENDING"),
        ("paid", "PAID"),
        ("failed", "FAILED"),
        ("refunded", "REFUNDED"),
    ]

    PAYMENT_METHOD = [
        ("cod", "CASH ON DELIVERY"),
        ("online", "ONLINE PAYMENT"),
    ]


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")

    address = models.ForeignKey(Address, on_delete=models.PROTECT)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=30, choices=ORDER_STATUS, default="pending")

    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD)

    payment_status = models.CharField(max_length=30, choices=PAYMENT_STATUS, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    book = models.ForeignKey(Book, on_delete=models.PROTECT)

    quantity = models.PositiveIntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.order.id} - {self.book.title}"