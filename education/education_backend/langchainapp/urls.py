from django.urls import path
from langchainapp.views import *

urlpatterns = [
    path('grade', CHAT.as_view(), name='grade'),
    path('get_attr', GetAttr.as_view(), name='get_attr'),
    path('save_attr', SaveAttr.as_view(), name='save_attr'),
    path('chat', CHAT.as_view(), name='chat'),
    path('translate', Translate.as_view(), name='translate')
]
