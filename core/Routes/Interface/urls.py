from django.urls import path
from core.Controller import InterfaceController as int

urlpatterns = [
#                           URL                                          # Level Token    
    path('', int.indexView, name="InterfaceIndexView"),                 
    
]
