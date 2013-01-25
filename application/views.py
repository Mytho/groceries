# -*- coding: utf-8 -*-
"""
    APPLICATION.VIEWS
    -----------------
    Controls the routes and serves templates to the user.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app

from flask import make_response

@app.route('/')
def home():
    return make_response('Hello, World!')
