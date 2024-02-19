from rest_framework import serializers
from users.models import User

class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'user_role']

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['email', 'password']