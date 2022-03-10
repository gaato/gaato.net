# gaato.net

Copyright 2022 Gakuto Furuya

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## What is this

My homepage and LaTeX API.

This includes [Honoka](https://github.com/windyakin/Honoka), [CodeMirror](https://github.com/codemirror/codemirror) and [HackGen](https://github.com/yuru7/HackGen).

## Requirements

- Python **> 3.10**
- Docker

## How to run

For production environment
```sh
$ git clone https://github.com/gaato/gaato.net.git gaato_net
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
$ git clone https://github.com/gaato/gaato.net.git gaato_net
$ cd gaato_net
$ pip install -r requirements.txt
$ python gaato_net/generate_secretkey_setting.py > gaato_net/local_settings.py
$ sudo docker build -t tex ./container # To host LaTeX API. It takes long time.
$ env DJANGO_SETTINGS_MODULE=gaato_net.settings_dev python manage.py runserver
```
