# -*- coding: utf-8 -*-
"""
    APPLICATION
    -----------
    Initialize the core environment for the application.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import Flask


app = Flask(__name__)
app.config.from_object('application.config')


import application.errorhandler
import application.auth
import application.views


# This sets `REMOTE_ADDR`, `HTTP_POST` from `X-Forwarded` headers.
# Commonly used for HTTP Proxy support.
from werkzeug.contrib.fixers import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)
