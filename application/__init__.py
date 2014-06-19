# -*- coding: utf-8 -*-
"""
    APPLICATION
    -----------
    Initialize the core environment for the application.

    Copyright (c) 2014 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import json
import os
from decorators import cache_control, content_type
from flask import (abort, make_response, render_template, request,
                   send_from_directory, Flask)
from flask.ext.login import login_required
from werkzeug.contrib.fixers import ProxyFix
from .auth import init_auth, logged_in_or_redirect
from .models import db, Item


app = Flask(__name__)
app.config.from_object('application.config')
db.init_app(app)
init_auth(app)


@app.errorhandler(400)
def bad_request(e):
    return render_template('error/400.html'), 400


@app.errorhandler(401)
def unauthorized(e):
    return render_template('error/401.html'), 401


@app.errorhandler(403)
def forbidden(e):
    return render_template('error/403.html'), 403


@app.errorhandler(404)
def not_found(e):
    return render_template('error/404.html'), 404


@app.errorhandler(500)
def internal_error(e):
    return render_template('error/500.html'), 500


@app.route('/favicon.ico', methods=['GET'])
@content_type('image/vnd.microsoft.icon')
def favicon():
    static_path = os.path.join(app.root_path, 'static')
    return make_response(send_from_directory(static_path,
                                             'icons/shopping-cart-32x32.png'))


@app.route('/')
@logged_in_or_redirect
@cache_control()
def home():
    return make_response(render_template('home.html'))


@app.route('/items', methods=['GET'])
@login_required
@content_type('application/json')
def get_items():
    items = Item.query.filter_by(bought_by=None)
    return make_response(json.dumps([item.serialize() for item in items]))


@app.route('/items', methods=['POST'])
@login_required
@content_type('application/json')
def post_items():
    if not request.data:
        abort(400)
    data = json.loads(request.data)
    item = Item.create(data['name'])
    return make_response(json.dumps(item.serialize()))


@app.route('/items/<item_id>', methods=['PUT'])
@login_required
@content_type('application/json')
def put_items(item_id):
    if not request.data:
        abort(400)
    data = json.loads(request.data)
    item = Item.bought(item_id, data['bought'])
    if not item:
        abort(404)
    return make_response(json.dumps(item.serialize()))


@app.route('/items/<item_id>', methods=['DELETE'])
@login_required
@content_type('application/json')
def delete_items(item_id):
    Item.delete(item_id)
    return make_response('')


@app.route('/suggestions', methods=['GET'])
@login_required
@content_type('application/json')
def get_suggests():
    suggestions = [dict([['name', k], ['count', v]])
                   for (k, v) in Item.suggestions()]
    return make_response(json.dumps(suggestions))


# This sets `REMOTE_ADDR`, `HTTP_POST` from `X-Forwarded` headers.
# Commonly used for HTTP Proxy support.
app.wsgi_app = ProxyFix(app.wsgi_app)
