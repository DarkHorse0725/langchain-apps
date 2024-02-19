from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.views.decorators.csrf import csrf_exempt

from users.models import User
from users.serializers import LoginSerializer, RegistrationSerializer


@api_view(['POST'])
@csrf_exempt
def login(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = User.objects.filter(email=email).first()

        if user is not None:
            user = User.objects.filter(email=email, password=password).first()
            if user is not None:
                return Response({'message': 'Logged in successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'User doesn\'t exist.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Method is not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@csrf_exempt
def register(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user_role = serializer.validated_data['user_role']

        user, created = User.objects.get_or_create(email=email, defaults={'password': password, 'name': name, 'user_role': user_role})
        
        # print('user = ', user.name)
        # print('created = ', created)
        if created:
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)
