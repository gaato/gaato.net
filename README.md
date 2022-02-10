# gaato.net

## What is this

My homepage and LaTeX API.

This includes [Bootstrap](https://github.com/twbs/bootstrap) and [Now UI Kit](https://github.com/creativetimofficial/now-ui-kit).

## Requirements

- Python **> 3.10**
- Docker

## How to run

For production environment
```sh
$ git clone git@github.com:gaato/gaato.net.git gaato_net
$ cd gaato_net
$ pip install -r requirements.txt
$ echo "ALLOWED_HOSTS = <Your Host Name>" > .env
$ python gaato_net/generate_secretkey_setting.py > gaato_net/local_settings.py
$ sudo docker build -t tex ./container # To host LaTeX API. It takes long time.
$ # Use nginx and gunicorn or something
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
