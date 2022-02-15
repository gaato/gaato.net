import os

from dotenv import load_dotenv

from .settings_common import *


load_dotenv(verbose=True)


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False


ALLOWED_HOSTS = [os.environ.get('ALLOWED_HOSTS')]


STATIC_ROOT = '/usr/share/nginx/html/static'
