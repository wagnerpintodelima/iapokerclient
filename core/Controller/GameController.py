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
from core.Controller.InterfaceController import getTokens
from django.db.models import Q
from django.db import transaction



@require_http_methods(["GET"])
def indexView(request):            
    return render(request, 'Game/index.html', getTokens(request))
