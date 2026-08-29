from django.shortcuts import render
from .serializers import UserRegisterSerializer, AddressSerializer, UserProfileSerializer
from rest_framework import generics, viewsets
from .models import User, Address
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, reqquest):
        response = {
            'status': "Reqquest was permitted"
        }
        return Response(response)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)

        if serializer.is_valid():
            is_default = serializer.validated_data.get("is_default", False)

            if is_default:
                Address.objects.filter(user=request.user).update(is_default=False)

            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, id):
        try:
            return Address.objects.get(id=id, user=request.user)
        except Address.DoesNotExist:
            return None

    def patch(self, request, id):
        address = self.get_object(request, id)

        if not address:
            return Response({"details":"Address not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AddressSerializer(address, data=request.data, partial=True)

        if serializer.is_valid():
            is_default = serializer.validated_data.get("is_default", address.is_default)

            if is_default:
                Address.objects.filter(user=request.user).exclude(id=address.id).update(is_default=False)

            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):

        address = self.get_object(request, id)

        if not address:
            return Response({"details":"Address not found"}, status=status.HTTP_404_NOT_FOUND)

        address.delete()

        return Response({"detail":"Address deleated successfully!"}, status=status.HTTP_204_NO_CONTENT)
        
 