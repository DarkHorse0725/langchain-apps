from rest_framework import serializers
from account.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError
from account.utils import Util



class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    
    class Meta:
        model = User
        fields = ["email", "name", "password", "password2", "tc"]
        extra_kwargs={
            "password": {"write_only": True}
        }
    
    #   ! validate password and confirm password
    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        return attrs
    
    #   ! create register user
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)



class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ["email", "password"]



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name"]



class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={"input_type": "password"}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fleids = ["password", "password2"]
    
    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        user = self.context.get("user")

        if password != password2:
            raise serializers.ValidationError("Password and Password2 doesn't match")
        
        user.set_password(password)
        user.save()

        return attrs



#!  Send Password Reset
class SendPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ["email"]
    
    def validate(self, attrs):
        email = attrs.get("email")

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)

            uid = urlsafe_base64_encode(force_bytes(user.id))
            print("User ID : ", uid)

            token = PasswordResetTokenGenerator().make_token(user)
            print("User Token : ", token)

            # link = f"http://127.0.0.1:8000/api/user/reset/{uid}/{token}/"
            link = f"http://localhost:3000/api/user/reset/{uid}/{token}"
            # link = "http://127.0.0.1:8000/api/user/reset/"+uid+"/"+token
            print(link)

            body = "Click the following link to reset you password " + link

            data = {
                "subject": "Reset Your Password",
                "body": body,
                "to_email": user.email
            }

            Util.send_email(data)

            return attrs
        else:
            raise ValidationError("You are not register user.")



#!  Reset Password
class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={"input_type": "password"}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={"input_type": "password"}, write_only=True)

    class Meta:
        fleids = ["password", "password2"]
    
    def validate(self, attrs):
        try:
            password = attrs.get("password")
            password2 = attrs.get("password2")
            uid = self.context.get("uid")
            token = self.context.get("token")

            if password != password2:
                raise serializers.ValidationError("Password and Password2 doesn't match")
            
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError("Token is not valid or expired.")
            
            user.set_password(password)
            user.save()

            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError("Token is not valid or expired.")
