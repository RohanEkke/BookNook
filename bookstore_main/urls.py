"""
URL configuration for bookstore_main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from accounts import views as UserView
from rest_framework.routers import DefaultRouter
from catalog import views as Bookview
from cart import views as CartView



urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/protected-view/', UserView.ProtectedView.as_view()),

    path('api/register', UserView.RegisterView.as_view()),

    path("api/profile/", UserView.UserProfileView.as_view(), name="profile"),

    path("api/addresses/", UserView.AddressListCreateView.as_view(), name="addresses"),

    path("api/addresses/<int:id>/", UserView.AddressDetailView.as_view(), name="address-detail"),

    path("api/books/", Bookview.BookView.as_view(), name="books"),

    path("api/book/<int:id>/", Bookview.BookDetailsView.as_view()),

    path("api/cart/", CartView.CartView.as_view(), name="cart"),

    path("api/cart/add/", CartView.CartItemView.as_view(), name="cart-add"),

    path("api/cart/items/<int:id>/", CartView.CartItemDetailView.as_view(), name="cart-item-detail"),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)