from django.shortcuts import render
from .serializers import CartItemSerializer, CartSerializer
from .models import CartItem, Cart
from rest_framework.views import APIView
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from catalog.models import Book

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):


        book_id = request.data.get("book_id")
        quantity = request.data.get("quantity", 1)

        if not book_id:
            return Response({"error":"quantity must be number"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response({"error":"quantity must be number"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "quantity must be greater then zero"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error":"Book not found"}, status=status.HTTP_404_NOT_FOUND)

        if quantity > book.stock:
            return Response({"error":"Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book, defaults={"quantity":quantity})

        if not created:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > book.stock:
                return Response({"error":"Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data, status=status.HTTP_200_OK)



class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            cart_item = CartItem.objects.get(id=id, cart__user = request.user)

        except CartItem.DoesNotExist:
            return Response({"error":"Cart item does not found"}, status=status.HTTP_404_NOT_FOUND)
        
        quantity = request.data.get("quantity")

        if quantity is None:
            return Response({"error":"quantity is required"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            quantity = int(quantity)

        except (TypeError, ValueError):
            return Response({"error":"quantity must be number"}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity <= 0:
            return Response({"error":"quantity must be greater then zero"}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity > cart_item.book.stock:
            return Response({"error":"Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.quantity = quantity
        cart_item.save()

        serializer = CartItemSerializer(cart_item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        try:
            cart_item = CartItem.objects.get(id=id, cart__user=request.user)

        except CartItem.DoesNotExist:
            return Response({"error":"cart item not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.delete()
        
        return Response({"message":"item removed from cart"}, status=status.HTTP_200_OK)