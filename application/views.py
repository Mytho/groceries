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
from models import Item
from decorators import content_type

from flask import make_response, render_template, request, send_from_directory
from flask.ext.login import login_required

from json import dumps, loads
from os import path


@app.route('/favicon.ico', methods=['GET'])
@content_type('image/vnd.microsoft.icon')
def favicon():
    return make_response(send_from_directory(path.join(app.root_path, 'static'),
                                             'favicon.ico'))

@app.route('/')
@login_required
def home():
    return make_response(render_template('home.html'))

@app.route('/items', methods=['GET'])
@login_required
@content_type('application/json')
def get():
    return make_response(dumps([item.serialize() for item in Item.query.all()]))

@app.route('/items', methods=['POST'])
@login_required
@content_type('application/json')
def post():
    data = loads(request.data)
    item = Item.create(data['name'])
    return make_response(dumps(item.serialize()))

@app.route('/items/<item_id>', methods=['PUT'])
@login_required
@content_type('application/json')
def put(item_id):
    data = loads(request.data)
    item = Item.by_id(item_id)
    item = item.bought(data['bought'])
    return make_response(dumps(item.serialize()))

@app.route('/items/<item_id>', methods=['DELETE'])
@login_required
@content_type('application/json')
def delete(item_id):
    Item.delete(item_id)
    return make_response('')
