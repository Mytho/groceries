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
from flask import make_response, redirect, render_template, request, url_for
from flask.ext.login import current_user, LoginManager, login_user, logout_user
from functools import wraps
from models import User
from werkzeug.security import check_password_hash


login_manager = LoginManager()
login_manager.init_app(app)


def logged_in_or_redirect(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated():
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if check_password_hash(user.password, request.form['password']):
            login_user(user)
            return redirect(url_for('home'))
    return make_response(render_template('login.html'))

@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('login'))
