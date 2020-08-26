from django.urls import path

from .views import (
    ChatListView,
    ChatCreateView,
    ChatDeleteView,
    ProfileViewSet
)

urlpatterns = [
    path('', ChatListView.as_view()),
    path('create/', ChatCreateView.as_view()),
    path('<pk>/delete/', ChatDeleteView.as_view()),
    path('profile/', ProfileViewSet.as_view())
]
