from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def index(request):
    return HttpResponse("Hello world, Yoy're at the polls index.")
#해당 작성한 코드를 웹 페이지에서 display하기 위해서 url 코드를 작성해야 한다.