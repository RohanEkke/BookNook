from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serializers import OrderItemSerializer, OrderSerializer
from .models import Order, OrderItem
from catalog.models import Book
from accounts.models import Address
from cart.models import Cart, CartItem



class OrderCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address_id = request.data.get("address_id")
        payment_method = request.data.get("payment_method")
        checkout_type = request.data.get("checkout_type")

        if not address_id:
            return Response({"error":"Address is required"}, status=status.HTTP_400_BAD_REQUEST)

        if payment_method not in ["cod", "online"]:
            return Response({"error":"Invalid payment method"}, status=status.HTTP_400_BAD_REQUEST)

        if checkout_type not in ["cart", "buy_now"]:
            return Response({"error":"Invalid checkout type"}, status=status.HTTP_400_BAD_REQUEST)


        try:
            address = Address.objects.get(id=address_id, user=request.user)

        except Address.DoesNotExist:
            return Response({"error":"Address not found"}, status=status.HTTP_404_NOT_FOUND)


        if checkout_type == "buy_now":
            book_id = request.data.get("book_id")
            quantity = request.data.get("quantity")

            if not book_id or not quantity:
                return Response({"error":"Book id and quantity required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                book = Book.objects.get(id=book_id)
            except Book.DoesNotExist:
                return Response({"error":"Book not found"}, status=status.HTTP_404_NOT_FOUND)

            quantity=int(quantity)

            if quantity <= 0:
                return Response({"error":"Quantity must be greater then zero"}, status=status.HTTP_400_BAD_REQUEST)

            if book.stock < quantity:
                return Response({"error":f"Only {book.stock} items available"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = book.price * quantity

            order = Order.objects.create(user=request.user, address=address, total_amount=total_amount, payment_method=payment_method)

            OrderItem.objects.create(order=order, book=book, quantity=quantity, price=book.price)
            book.stock -= quantity
            book.save()

        else:
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({"error":"Cart does not found"}, status=status.HTTP_404_NOT_FOUND)

            # print("USER:", request.user)
            # print("CART ID:", cart.id)

            cart_items = cart.items.all()

            # print("CART ITEMS:", cart_items)
            # print("CART ITEM COUNT:", cart_items.count())

            if not cart_items.exists():
                return Response({"error":"Your cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = 0

            for item in cart_items:
                if item.book.stock < item.quantity:
                    return Response({"error": f"Not enougn stock for {item.book.title}"}, status=status.HTTP_400_BAD_REQUEST)

                total_amount += item.book.price * item.quantity

            order = Order.objects.create(user=request.user, address=address, total_amount=total_amount, payment_method=payment_method)

            for item in cart_items:
                OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity, price=item.book.price)

                item.book.stock -= item.quantity
                item.book.save()

            cart_items.delete()


        serializer = OrderSerializer(order)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

            
