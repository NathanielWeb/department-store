from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, FavouriteProduct, CartItem

# Extend UserAdmin (base account that handles login, password, emails, etc)
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "is_staff")


@admin.register(FavouriteProduct)
class FavouriteProductAdmin(admin.ModelAdmin):
    list_display = ("user", "product_id")



@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "product_id", "quantity")


    