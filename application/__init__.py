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
import time
import os
from decorators import cache_control, content_type
from flask import (abort, flash, make_response, redirect, render_template,
                   request, url_for, send_from_directory, Flask)
from flask.ext.login import (current_user, LoginManager, login_required,
                             login_user, logout_user)
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import desc, func
from functools import wraps
from werkzeug.contrib.fixers import ProxyFix
from werkzeug.security import check_password_hash


app = Flask(__name__)
app.config.from_object('application.config')
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


# Models
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(64))
    active = db.Column(db.Integer)

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

    def is_authenticated(self):
        return True

    def is_active(self):
        return True if self.active else False

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    create_date = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    bought_date = db.Column(db.Integer)
    bought_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    created_user = db.relationship('User',
                                   backref=db.backref('created_items',
                                                      lazy='dynamic'),
                                   foreign_keys=[created_by])

    bought_user = db.relationship('User',
                                  backref=db.backref('bought_items',
                                                     lazy='dynamic'),
                                  foreign_keys=[bought_by])

    def __init__(self, name):
        self.name = name
        self.create_date = time.time()
        self.created_by = current_user.get_id()
        self.bought_date = None
        self.bought_by = None

    def __repr__(self):
        return '<Item %r>' % self.name

    @staticmethod
    def bought(item_id, bought):
        item = Item.query.get(item_id)
        if not item:
            return item
        if bought:
            item.bought_by = current_user.get_id()
            item.bought_date = time.time()
        else:
            item.bought_by = None
            item.bought_date = None
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def create(name):
        item = Item(name)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def delete(item_id):
        db.session.delete(Item.query.get(item_id))
        db.session.commit()

    @staticmethod
    def suggestions():
        return db.session \
            .query(Item.name, func.count(Item.name).label('count')) \
            .group_by(Item.name) \
            .order_by(desc('count')).all()

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'create_date': self.create_date,
                'created_by': self.created_by,
                'bought_date': self.bought_date,
                'bought_by': self.bought_by}


# Error handling
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
