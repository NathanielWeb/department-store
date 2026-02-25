from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, FavouriteProductViewSet, CartItemViewSet, RegisterView, health_check
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# Create a DefaultRouter
router = DefaultRouter()

# Register the routes
router.register(r'users', CustomUserViewSet, basename='customuser')
router.register(r'favourites', FavouriteProductViewSet, basename='favouriteproduct')
router.register(r'cart', CartItemViewSet, basename='cartitem')

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Health check
    path("health/", health_check),

    # API resources
    path('', include(router.urls))
]