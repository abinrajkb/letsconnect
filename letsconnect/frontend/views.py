from django.shortcuts import render

def frontend(request):
    return render(request, 'frontend/index.html')
