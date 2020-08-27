from django.contrib import admin

from .models import Message, Chat, Profile

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Profile)
