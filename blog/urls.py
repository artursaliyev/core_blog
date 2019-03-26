
from django.urls import path
from . import views as blog_view

app_name = 'blog'
urlpatterns = [
    path('', blog_view.index, name='index'),
    path('ajax/', blog_view.index_ajax, name='index_ajax'),
    path('upload/', blog_view.BasicUploadView.as_view(), name='upload'),
    path('<int:pk>/upload-detail/', blog_view.JsonDataCreateView.as_view(), name='upload-detail'),
    path('user/', blog_view.UsersView.as_view(), name='user_list'),
    path('data_for_site/', blog_view.data_for_site, name='data_for_size'),
    path('clear_database/', blog_view.clear_database, name='clear_database'),

]

