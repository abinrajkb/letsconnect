from django.contrib.auth.models import User
from django.db import models


class Chat(models.Model):
    created_by = models.CharField(max_length=20)
    created_for = models.CharField(max_length=20)

    def __str__(self):
        return "{}".format(self.pk)


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name="messages", on_delete=models.CASCADE)
    content = models.TextField()
    sender = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}".format(self.chat.id)


class Profile(models.Model):
    user = models.ForeignKey(User, related_name="profile", on_delete=models.CASCADE)
    profilePic = models.ImageField(upload_to="profilePics", default="/profilePics/avatar.svg")