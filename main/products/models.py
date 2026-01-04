from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Register your models here.

class CustomUser(AbstractUser):
    pass

# Favourite products table
class FavouriteProduct(models.Model):
    # Means many FavouriteProduct rows can point to one user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, # References active user model (in this case CustomUser)
        on_delete = models.CASCADE, # If a user is deleted then this will delete all their favourite products
        related_name = "favourites" # Sets it up so that you can go from a user and get all of their favourite products using this name
    )
    product_id = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.URLField(blank=True, null=True)
    rating = models.FloatField()

    class Meta: 
        unique_together = ("user", "product_id") # Makes it so combination of user and product id must be unique (a user cannot favourite the same product twice)

    def __str__(self):
        return f"{self.user.username} favourited product {self.product_id}"


# Cart Table
class CartItem(models.Model):
    # Means many CartItem rows can point to one user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, # References active user model (in this case CustomUser)
        on_delete = models.CASCADE, # If a user is deleted then this will delete all their cart items
        related_name = "cart_items" # Sets it up so that you can go from a user and get all of their cart items using this name
    )
    
    product_id = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.URLField(blank=True, null=True)
    rating = models.FloatField()


    class Meta: 
        unique_together = ("user", "product_id") # Makes it so combination of user and product id must be unique (a user cannot add the same product to the cart twice)

    def __str__(self):
        return f"{self.user.username} added {self.product_id} (x{self.quantity}) to the cart"