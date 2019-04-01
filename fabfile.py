"""Author Artur Saliyev
   version 1.0
   March 2019 y.
   Open source
"""


import os
from fabric.state import env
from fabric.api import cd, run, sudo, settings
from fabric.contrib.files import exists, upload_template


env.hosts = ['ssh_user@host']


def deploy():
    """Deploy project"""
    set_env()
    install_system_libs()
    create_folders()
    get_src()
    create_virtealenv()
    install_venv_libs()
    configure_nginx()

    # set_locale()

    configure_gunicorn_and_supervisor()
    run_django_commands()

    create_sertificate()

    restsrt_all()


def update():
    """Update project"""
    set_env()
    get_src()
    install_venv_libs()
    configure_nginx()
    configure_gunicorn_and_supervisor()
    run_django_commands()
    restsrt_all()


def set_env():
    env.BASE_SRC_PATH = '/home/devops/projects'
    env.PROJECT_NAME = 'core'

    # /home/devops/projects/core/
    env.REMOTE_PROJECT_PATH = os.path.join(env.BASE_SRC_PATH, env.PROJECT_NAME)

    env.GIT_REPO_PATH = 'https://github.com/artursaliyev/core_blog.git'

    # /home/devops/projects/core/venv/
    env.REMOTE_VENV_PATH = os.path.join(
        env.REMOTE_PROJECT_PATH,
        'venv',
    )

    env.BASE_REMOTE_PYTHON_PATH = '/usr/bin/python3.5'

    env.VENV_REMOTE_PYTHON_PATH = os.path.join(env.REMOTE_VENV_PATH, 'bin', 'python3.5', )

    env.CERTIFICATE_PATH = '/etc/nginx/ssl'


def _put_template(template_name, remote_path, use_sudo=False):
    upload_template(
        os.path.join('deploy_templates', template_name),
        remote_path,
        context={
            'remote_project_url': env.REMOTE_PROJECT_PATH,
            'user_name': env.USER_NAME,
        },
        use_sudo=True,
        use_jinja=True
    )


def _mkdir(path):
    run('mkdir -p %s' % path)


def set_locale():
    with cd(env.REMOTE_VENV_PATH):
        sudo('export LC_ALL="en_US.UTF-8"')
        sudo('export LC_TYPE="en_US.UTF-8"')
        sudo('dpkg-reconfigure locales --default-priority')


def install_system_libs():
    sudo('apt-get update -y')
    sudo('apt-get upgrade -y')
    sudo('apt-get install -y python3.5-dev')
    sudo('apt-get install -y python3-pip')
    sudo('apt-get install -y python3-venv')
    sudo('apt-get install -y nginx')
    sudo('apt-get install -y supervisor')
    sudo('apt-get install -y git')
    sudo('apt-get install -y python2.7')


def create_folders():
    _mkdir(env.REMOTE_PROJECT_PATH)


def get_src():
    with cd(env.REMOTE_PROJECT_PATH):
        if not exists(os.path.join(env.REMOTE_PROJECT_PATH, '.git')):
            run('git clone %s .' % env.GIT_REPO_PATH)
        else:
            run('git pull %s' % env.GIT_REPO_PATH)


def create_virtealenv():
    if not exists(env.REMOTE_VENV_PATH):
        run('%s -m venv %s' % (env.BASE_REMOTE_PYTHON_PATH, env.REMOTE_VENV_PATH))


def install_venv_libs():
    run('%s -m pip install --upgrade pip' % (
        env.VENV_REMOTE_PYTHON_PATH
    ))

    run('%s -m pip install -r %s' % (
        env.VENV_REMOTE_PYTHON_PATH,
        os.path.join(env.REMOTE_PROJECT_PATH, 'requirements.txt')
    ))


def configure_nginx():
    _put_template(
        'nginx.conf',
        os.path.join('/etc/nginx/sites-available', env.PROJECT_NAME),
        use_sudo=True,
    )

    sites_enabled_link = os.path.join('/etc/nginx/sites-enabled', env.PROJECT_NAME)

    if not exists(sites_enabled_link):
        sudo('ln -s %s %s' % (
            os.path.join('/etc/nginx/sites-available', env.PROJECT_NAME),
            sites_enabled_link,
        ))


def configure_gunicorn_and_supervisor():
    _put_template(
        'gunicorn.py',
        os.path.join(env.REMOTE_PROJECT_PATH, 'gunicorn.py'),
    )

    _put_template(
        'supervs.conf',
        os.path.join('/etc/supervisor/conf.d', 'supervs.conf'),
    )


def run_django_commands():

    run('%s %s migrate' % (
        env.VENV_REMOTE_PYTHON_PATH,
        os.path.join(env.REMOTE_PROJECT_PATH, 'manage.py')

    ))

    run('%s %s collectstatic --noinput' % (
        env.VENV_REMOTE_PYTHON_PATH,
        os.path.join(env.REMOTE_PROJECT_PATH, 'manage.py')

    ))


def create_sertificate():
    sudo('mkdir -p %s ' % env.CERTIFICATE_PATH)
    if not exists(os.path.join(env.CERTIFICATE_PATH, 'core.crt'), use_sudo=True):
        sudo('openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout %s -out %s' %
             (os.path.join(env.CERTIFICATE_PATH, 'core.key'),
              os.path.join(env.CERTIFICATE_PATH, 'core.crt')))


def restsrt_all():
    sudo('supervisorctl reread')
    sudo('supervisorctl update')
    sudo('supervisorctl restart core_blog')
    sudo('service nginx reload')
    # sudo('service nginx restart')






