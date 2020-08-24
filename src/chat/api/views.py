from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import serializers

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from chat.models import Chat
from .serializers import ChatSerializer


class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = Chat.objects.filter(Q(created_by=username) | Q(created_for=username))
        return queryset


class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )


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


class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ChatDeleteView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )
