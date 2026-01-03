from rest_framework import serializers
from .models import CustomUser, FavouriteProduct, CartItem

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']

# Register serrializer to hash password
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        error_messages={
            "min_length": "Password must be at least 8 characters long"
        }
    )

    class Meta:
        model = CustomUser
        fields = ["username", "password"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )
        return user

class FavouriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavouriteProduct
        fields = ['id', 'product_id']

class CartItemSerializer(serializers.ModelSerializer):
    # Assert that quantity is an int between 1 and 10
    quantity = serializers.IntegerField(min_value=1, max_value=10)

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']


    