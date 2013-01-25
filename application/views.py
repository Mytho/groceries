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
from decorators import content_type

from flask import make_response, send_from_directory
from os import path


@app.route('/favicon.ico', methods=['GET'])
@content_type('image/vnd.microsoft.icon')
def favicon():
    return make_response(send_from_directory(path.join(app.root_path, 'static'),
                                             'favicon.ico'))

@app.route('/')
def home():
    return make_response('Hello, World!')
