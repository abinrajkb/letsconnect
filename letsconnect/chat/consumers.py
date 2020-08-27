from django.contrib.auth.models import User
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from .views import get_last_10_messages, get_current_chat
import json


class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        messages = get_last_10_messages(data['chatID'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_jason(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        current_chat = get_current_chat(data['chatID'])
        message = Message.objects.create(chat=current_chat, content=data['message'], sender=data['from'])
        message.save()

        content = {
            'command': 'new_message',
            'message': self.message_to_jason(message)
        }
        return self.send_chat_message(content)

    def messages_to_jason(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_jason(message))
        return result

    def message_to_jason(self, message):
        return {
            'id': message.id,
            'author': message.sender,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
