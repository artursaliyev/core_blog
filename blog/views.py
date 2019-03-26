from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.generic import ListView
from django.views.generic.base import View
from django.views.generic import DetailView
from .forms import JsonDataForm
from .models import JsonData
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .utilst import DATA_KEY


class UsersView(LoginRequiredMixin, ListView):
    """View user list"""
    model = User
    template_name = 'user_list.html'


@login_required(login_url='accounts/login/')
def index(request):
    """Asosiy sahifa koruvchlar uchun"""
    user = request.user

    if user.username == 'admin':
        return redirect('blog:upload')
    object_list = user.json_dates.all()

    return render(request, 'index.html', {'object_list': object_list})


@csrf_exempt
def index_ajax(request):
    user = request.user
    object_list = user.json_dates.all().values('data')
    return JsonResponse(list(object_list), safe=False)


class BasicUploadView(LoginRequiredMixin, View):
    """Upload files"""

    def get(self, request):
        object_list = JsonData.objects.all().prefetch_related('perm_users')
        return render(self.request, 'index_admin.html', {'object_list': object_list})

    def post(self, request):
        form = JsonDataForm(self.request.POST, self.request.FILES)
        if form.is_valid():
            obj = form.save()
            tz = timezone.get_default_timezone()
            data = {'is_valid': True, 'pk': obj.pk, 'data_': obj.data.name, 'created': obj.created.astimezone(tz).strftime('%d/%m/%Y, %H:%M:%S')}
        else:
            data = {'is_valid': False}
        return JsonResponse(data)


class DetailUploadView(LoginRequiredMixin, DetailView):
    """Detail view for upload json file"""
    model = JsonData
    template_name = 'upload-detail.html'
    context_object_name = 'obj'


class JsonDataCreateView(LoginRequiredMixin, View):
    """Create privileges for users"""

    def get(self, request, *args, **kwargs):
        print(self.kwargs)
        obj = get_object_or_404(JsonData, pk=self.kwargs['pk'])
        form = JsonDataForm(instance=obj)
        return render(request, 'upload-detail.html', {'obj': obj, 'form': form})

    def post(self, *args, **kwargs):
        obj = get_object_or_404(JsonData, pk=self.kwargs['pk'])
        form = JsonDataForm(self.request.POST, instance=obj)
        if form.is_valid():
            print('valid')
            form.save()
        return redirect('blog:upload')


@login_required(login_url='accounts/login/')
def data_for_site(request):
    """Data key for client. Send only one time """
    return render(request, "date_for_site.html", {'data': DATA_KEY})


@login_required(login_url='accounts/login/')
def clear_database(request):
    """Clear all files """
    JsonData.objects.all().delete()
    return redirect('blog:upload')

