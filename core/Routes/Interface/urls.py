from django.urls import path
from core.Controller import InterfaceController as int, GameController as game

urlpatterns = [
#                           URL                                          # Level Token    
    path('', int.indexView, name="InterfaceIndexView"), 
    path('game/', game.indexView, name="GameIndexView"), 
    
]
