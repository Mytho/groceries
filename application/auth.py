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
    return User.query.filter_by(id=user_id).first()


@app.route('/login')
def login():
    # TODO: Create proper login functionality
    login_user(User.query.filter_by(id=1).first())
    return make_response('Logged In')

@app.route('/logout')
def logout():
    # TODO: Create proper logout functionality
    logout_user()
    return make_response('Logged out')
