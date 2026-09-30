from django.contrib import admin
from .models import Order, OrderItem, Refund, ReturnItem, ReturnRequest, Shipment, ShipmentEvent

# Register your models here.
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["user", "address", "total_amount", "status", "payment_method", "payment_status"]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order", "book", "quantity", "price"]

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ["order", "courier_name", "tracking_number", "status", "estimated_delivery_date", "shipped_at", "delivered_at"]

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = ["order", "user", "reason", "status"]

@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ["order", "return_request", "amount", "status", "payment_reference", "initiated_at", "completed_at"]

@admin.register(ReturnItem)
class ReturnItemAdmin(admin.ModelAdmin):
    list_display = ["return_request", "order_item", "quantity"]


@admin.register(ShipmentEvent)
class ShipmentEventAdmin(admin.ModelAdmin):
    list_display = ["shipment", "status", "location", "event_time", "created_at"]
