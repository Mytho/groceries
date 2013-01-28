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

from flask import make_response, redirect, url_for
from flask.ext.login import LoginManager, login_user, logout_user


login_manager = LoginManager()
login_manager.setup_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # TODO: Create proper login functionality
    login_user(User.query.get(2))
    return make_response('Login view')

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
