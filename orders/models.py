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



class Shipment(models.Model):

    DELIVERY_STATUS = [
        ("pending", "PENDING"),
        ("picked_up", "PICKED UP"),
        ("in_transit", "IN TRANSIT"),
        ("out_for_delivery", "OUT FOR DELIVERY"),
        ("delivered", "DELIVERED"),
        ("failed", "DELIVERY FAILED"),
        ("returned", "RETURNED"),
    ]

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="shipment"
    )

    courier_name = models.CharField(max_length=100, blank=True)

    tracking_number = models.CharField(
        max_length=150,
        blank=True
    )

    tracking_url = models.URLField(
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=DELIVERY_STATUS,
        default="pending"
    )

    estimated_delivery_date = models.DateTimeField(
        null=True,
        blank=True
    )

    shipped_at = models.DateTimeField(
        null=True,
        blank=True
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"#{self.order.id} - {self.status}"


class ReturnRequest(models.Model):

    RETURN_STATUS = [
        ("requested", "REQUESTED"),
        ("approved", "APPROVED"),
        ("rejected", "REJECTED"),
        ("pickup_scheduled", "PICKUP SCHEDULED"),
        ("picked_up", "PICKED UP"),
        ("received", "RECEIVED"),
        ("completed", "COMPLETED"),
        ("cancelled", "CANCELLED"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="returns"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="return_requests"
    )

    reason = models.TextField()

    status = models.CharField(
        max_length=30,
        choices=RETURN_STATUS,
        default="requested"
    )

    requested_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.order.id} - {self.reason}"


class ReturnItem(models.Model):

    return_request = models.ForeignKey(
        ReturnRequest,
        on_delete=models.CASCADE,
        related_name="items"
    )

    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.return_request}"


class Refund(models.Model):

    REFUND_STATUS = [
        ("pending", "PENDING"),
        ("processing", "PROCESSING"),
        ("completed", "COMPLETED"),
        ("failed", "FAILED"),
        ("cancelled", "CANCELLED"),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="refunds"
    )

    return_request = models.ForeignKey(
        ReturnRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="refunds"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=30,
        choices=REFUND_STATUS,
        default="pending"
    )

    payment_reference = models.CharField(
        max_length=200,
        blank=True
    )

    initiated_at = models.DateTimeField(
        null=True,
        blank=True
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.order} - {self.status}"


class ShipmentEvent(models.Model):
    EVENT_STATUS = [
        ("pending", "PENDING"),
        ("picked_up", "PICKED UP"),
        ("in_transit", "IN TRANSIT"),
        ("arrived_at_facility", "ARRIVED AT FACILITY"),
        ("out_for_delivery", "OUT FOR DELIVERY"),
        ("delivered", "DELIVERED"),
        ("failed", "DELIVERY FAILED"),
        ("returned", "RETURNED"),
    ]

    shipment = models.ForeignKey(
        Shipment,
        on_delete=models.CASCADE,
        related_name="events"
    )

    status = models.CharField(max_length=50, choices=EVENT_STATUS)

    location = models.CharField(
        max_length=200,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    event_time = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.shipment} - {self.location}"
