from django.contrib import admin

# Register your models here.

from .models import User, Address

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "is_staff", "is_active"]
    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["full_name", "user", "city", "state", "is_default"]
    list_filter = ("address_type", "is_default")
    search_fields = ("full_name", "city", "user__email")

