from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from account.serializers import UserRegistrationSerializer, LoginSerializer, ProfileSerializer, ChangePasswordSerializer, SendPasswordResetSerializer, PasswordResetSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


#!  register
class UserRegisterView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        #!  send data
        serializer = UserRegistrationSerializer(data=request.data)

        #!  check valid data
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({"token": token, "message": "Register successfull"}, status=status.HTTP_201_CREATED)    


#!  login
class LoginView(APIView):
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        
        email = serializer.data.get("email")
        password = serializer.data.get("password")
        user = authenticate(email=email, password=password)

        if user is not None:
            token = get_tokens_for_user(user)

            return Response({"token": token, "message": "Login Success"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": {"non_field_errors": ["Email or Password not found"]}},status=status.HTTP_404_NOT_FOUND)




#!  profile
class ProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


#!  change password view
class ChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data, context={"user": request.user})

        serializer.is_valid(raise_exception=True)
        
        return Response({"message": "Password Changed"}, status=status.HTTP_200_OK)


#!  Send Password Reset
class SendPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        return Response({"message": "Reset Password Link Sent On Your Email, Please Check Your Email."}, status=status.HTTP_200_OK)


#!  Reset Password
class PasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = PasswordResetSerializer(data=request.data, context={"uid": uid, "token": token})

        serializer.is_valid(raise_exception=True)
        return Response({"message": "Password Reset Successfully."}, status=status.HTTP_200_OK)