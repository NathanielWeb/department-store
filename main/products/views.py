from rest_framework import viewsets, permissions, generics
from .models import CustomUser, FavouriteProduct, CartItem
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer, FavouriteProductSerializer, CartItemSerializer, RegisterSerializer

# Object-level permission: (Makes it so only the owner of an object can access that object)
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        
        # Allow staff/superusers to access any user
        if request.user.is_staff or request.user.is_superuser:
            return True
        

        # This is the check for user-related objects
        # Checks whether obj (which could be an isntance of FavouriteProduct, CartItem, or CustomUser) has a user attribute
        if hasattr(obj, 'user'): 
            return obj.user == request.user


        elif isinstance(obj, CustomUser):  
            # If it is a normal user then only return true if the object's (user instance) id matches the user id
            return obj.id == request.user.id
        

        return False
    

class CustomUserViewSet(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        requestUser = self.request.user

        # Allow admins to see all users
        if requestUser.is_staff or requestUser.is_superuser:
            return CustomUser.objects.all()
        
        # If the user is normal and not admin, just allow them to see themselves
        return CustomUser.objects.filter(id=requestUser.id)
    
# Use CreateAPIView here because we only want to POST
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    # Override create so that it generates jwt token as soon as user is registered
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })


    

class FavouriteProductViewSet(viewsets.ModelViewSet):
    serializer_class = FavouriteProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    http_method_names = ['get', 'post', 'delete'] # Users can get, add, and delete items from their favourites list

    def get_queryset(self):
        requestUser = self.request.user

        # Allow admins to see all users
        if requestUser.is_staff or requestUser.is_superuser:
            return FavouriteProduct.objects.all()
        
        # If the user is normal and not admin, just allow them to see their own favourite products
        return FavouriteProduct.objects.filter(user=requestUser)
    
    def perform_create(self, serializer):
        # Automatically sets user to request.user
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    http_method_names = ['get', 'post', 'delete'] # Users can get, add, and delete items from their cart 

    def get_queryset(self):
        requestUser = self.request.user

        # Allow admins to see all users
        if requestUser.is_staff or requestUser.is_superuser:
            return CartItem.objects.all()
        
        # If the user is normal and not admin, just allow them to see their own cart items
        return CartItem.objects.filter(user=requestUser)
    
    def perform_create(self, serializer):
        # Automatically sets user to request.user
        serializer.save(user=self.request.user)



