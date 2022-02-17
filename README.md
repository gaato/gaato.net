# gaato.net

Copyright 2022 Gakuto Furuya

## What is this

My homepage and LaTeX API.

This includes [Now UI Kit](https://github.com/creativetimofficial/now-ui-kit) and [CodeMirror](https://github.com/codemirror/codemirror).

## Requirements

- Python **> 3.10**
- Docker

## How to run

For production environment
```sh
$ git clone git@github.com:gaato/gaato.net.git gaato_net
$ cd gaato_net
$ pip install -r requirements.txt
$ echo "ALLOWED_HOSTS=<Your Host Name>" > .env
$ python gaato_net/generate_secretkey_setting.py > gaato_net/local_settings.py
$ sudo mkdir -p /usr/share/nginx/html/static
$ sudo chown <Your User Name> /usr/share/nginx/html/static
$ python manage.py collectstatic
$ mkdir logs
$ sudo docker build -t tex ./container # To host LaTeX API. It takes long time.
$ # Use Nginx and Gunicorn or something
```

For development environment
```sh
$ git clone git@github.com:gaato/gaato.net.git gaato_net
$ cd gaato_net
$ pip install -r requirements.txt
$ python gaato_net/generate_secretkey_setting.py > gaato_net/local_settings.py
$ sudo docker build -t tex ./container # To host LaTeX API. It takes long time.
$ env DJANGO_SETTINGS_MODULE=gaato_net.settings_dev python manage.py runserver
```
