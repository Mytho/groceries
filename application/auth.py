# -*- coding: utf-8 -*-
"""
    APPLICATION.AUTH
    ----------------
    Authentication for the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import (current_app, flash, make_response, redirect,
                   render_template, request, url_for)
from flask.views import View
from flask.ext.login import current_user, LoginManager, login_user, logout_user
from functools import wraps
from werkzeug.security import check_password_hash
from .models import User


login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def logged_in_or_redirect(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (not current_app.config.get('TESTING', False) and
           not current_user.is_authenticated()):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def init_auth(app):
    login_manager.init_app(app)
    app.add_url_rule('/login', view_func=LoginView.as_view('login'))
    app.add_url_rule('/logout', view_func=LogoutView.as_view('logout'))
    return login_manager


class LoginView(View):

    methods = ['GET', 'POST']

    def dispatch_request(self):
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


class LogoutView(View):

    def dispatch_request(self):
        logout_user()
        return redirect(url_for('login'))
