import json
from clientpoker.settings import ENDPOINT_API
import threading
import time
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from core.Controller.BaseController import chamar_api_externa, setSessionValue, getSessionValue
from django.db.models import Q
from django.db import transaction

endpoints = {
    'get_hash': '/api/get/hash',
    'list_table': '/api/table/list',
    'join_table': '/api/table/join',
    'table_players': '/api/table/players',
}

@require_http_methods(["GET"])
def indexView(request):    
    return render(request, 'Home/index.html', getTokens(request))

# É re-aproveitada em outras ocasioes
def getTokens(request):
    
    headers = {
        'SECRET_CODE_GLOBAL': 'django-insecure-kqd6gnzz^24qe7q#%z%zhux%vrlciaj^!=ijneth$870*+c=ry',
    }

    response = chamar_api_externa(endpoints['get_hash'], metodo='GET', headers=headers)
    
    setSessionValue(request, 'hash_system', response['hash_system'])
    setSessionValue(request, 'hash_admin', response['hash_admin'])
    
    return {
        'dados': json.dumps({
            'hash_system': response['hash_system'],
            'hash_admin': response['hash_admin'],
            'endpoints': endpoints,
            'ENDPOINT_API': ENDPOINT_API
        })
    }

    