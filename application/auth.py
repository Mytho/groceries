# -*- coding: utf-8 -*-
"""
    APPLICATION.AUTH
    ----------------
    Responsible for authenticating users.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app
from models import User

from flask import make_response
from flask.ext.login import LoginManager, login_user, logout_user


login_manager = LoginManager()
login_manager.setup_app(app)


@login_manager.user_loader
def load_user(user_id):
    # TODO: Proper user loading
    User.get(user_id)


@app.route('/login')
def login():
    # TODO: Implement the User Class Methods as mentioned in: http://packages.python.org/Flask-Login/
    login_user(User.query.filter_by(username='teun').first())
    return make_response('Logged In')

@app.route('/logout')
def logout():
    logout_user()
    return make_response('Logged out')
