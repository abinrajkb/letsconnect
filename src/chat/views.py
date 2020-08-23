from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from .models import Chat, Message


def get_last_10_messages(chatID):
    return Message.objects.filter(chat=chatID).order_by('-timestamp')[:10]

""" .order_by('-timestamp').all()[:10] """


""" def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user) """


def get_current_chat(chatID):
    return get_object_or_404(Chat, id=chatID)
