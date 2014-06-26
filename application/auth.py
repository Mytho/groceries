# -*- coding: utf-8 -*-
"""
    APPLICATION.AUTH
    ----------------
    Authentication for the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import (current_app, get_flashed_messages, flash, make_response,
                   redirect, render_template, request, session, url_for)
from flask.views import MethodView
from flask.ext.login import current_user, LoginManager, login_user, logout_user
from functools import wraps
from werkzeug.security import check_password_hash
from .models import User
from .security import check_csrf_token


login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    """Load the user with the given `user_id` from the database.

    user_id -- primary key of the user to load
    """
    return User.query.get(user_id)


def logged_in_or_redirect(f):
    """Check if the user is logged in, if not then redirect the user to the
    login page.

    f -- function to decorate with the functionality
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (not current_app.config.get('TESTING', False) and
           not current_user.is_authenticated()):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def init_auth(app):
    """Inititialize the login manager by binding it to the application and
    adding the login- and logout views.

    app -- current application
    """
    login_manager.init_app(app)
    app.add_url_rule('/login', view_func=LoginView.as_view('login'))
    app.add_url_rule('/logout', view_func=LogoutView.as_view('logout'))


class LoginView(MethodView):

    decorators = [check_csrf_token]

    def get(self):
        context = {'messages':get_flashed_messages(),
                   'username': session.pop('username', '')}
        return make_response(render_template('login.html', **context))

    def post(self):
        username = request.form['username']
        password = request.form['password']
        if username and password:
            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for('home'))
        session['username'] = username
        flash('The username or password you entered is incorrect')
        return redirect(url_for('login'))


class LogoutView(MethodView):

    def get(self):
        logout_user()
        return redirect(url_for('login'))
