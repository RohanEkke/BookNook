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

router = DefaultRouter()
router.register('api/address', UserView.AddressViewSet, basename="address")

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/protected-view/', UserView.ProtectedView.as_view()),

    path('api/register', UserView.RegisterView.as_view()),

    path("api/profile/", UserView.UserProfileView.as_view(), name="profile"),

    path('', include(router.urls)),

    path("api/books/", Bookview.BookView.as_view(), name="books"),

    path("api/book/<int:id>/", Bookview.BookDetailsView.as_view()),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)