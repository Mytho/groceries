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
from flask import (abort, flash, make_response, redirect, render_template,
                   request, url_for, send_from_directory, Flask)
from flask.ext.login import (current_user, LoginManager, login_required,
                             login_user, logout_user)
from functools import wraps
from werkzeug.contrib.fixers import ProxyFix
from werkzeug.security import check_password_hash
from .models import db, Item, User


app = Flask(__name__)
app.config.from_object('application.config')
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


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


# Authentication
def logged_in_or_redirect(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (not app.config.get('TESTING', False) and
           not current_user.is_authenticated()):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username and password:
            user = User.query.filter_by(username=username).first()
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for('home'))
        flash('Incorrect login supplied')
    return make_response(render_template('login.html'))


@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('login'))


# Views
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
