from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import serializers
from django.http import JsonResponse

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    DestroyAPIView,
)
from chat.models import Chat, Profile
from .serializers import ChatSerializer, ProfileSerializer


class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = Chat.objects.filter(Q(created_by=username) | Q(created_for=username))
        return queryset


class ChatCreateView(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def perform_create(self, serializer):
        chat = None
        created_by = serializer.data['created_by']
        created_for = serializer.data['created_for']
        
        try:
            user= User.objects.get(username=created_for)
            checkChat = Chat.objects.filter(Q(created_by=created_by, created_for=created_for) | 
            Q(created_by=created_for, created_for=created_by))

            if checkChat.count()==0:
                chat = Chat.objects.create(created_by = created_by, created_for = created_for)
            else:
                raise serializers.ValidationError("chat already exists")
            
        except User.DoesNotExist:
            raise serializers.ValidationError("user does not exist")

        return chat


class ChatDeleteView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )




class ProfileViewSet(ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def post(self, request, *args, **kwargs):
        username = request.data['username']
        user = User.objects.get(username=username)
        file = request.data['newDp']
        profile = Profile.objects.get(user=user)
        profile.profilePic=file
        profile.save()
        return JsonResponse({"picURL": "{}".format(profile.profilePic)})

    def get(self, request, *args, **kwargs):
        username = request.query_params['username']
        user = User.objects.get(username=username)
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=user)
        return JsonResponse({"picURL": "{}".format(profile.profilePic)})