# -*- coding: utf-8 -*-
"""
    APPLICATION.SECURITY
    --------------------
    Methods used to add extra security to the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import abort, current_app, request, session, url_for
from functools import wraps
from uuid import uuid4


def init_security(app):
    """Make `csrf_token()` globally available in all Jinja templates.

    app -- application to use for initialization
    """
    app.jinja_env.globals['csrf_token'] = generate_csrf_token


def check_csrf_token(f):
    """Wraps a function to check for the existance of a CSRF-token.

    f -- function to decorate
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'POST':
            token = session.pop('csrf', None)
            if (not current_app.config.get('TESTING', False) and (not token
               or token != request.form.get('csrf'))):
                abort(401)
        return f(*args, **kwargs)
    return decorated_function


def check_referer_header(f):
    """Wraps a function to check the referer-header.

    f -- function to decorate
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if (not current_app.config.get('TESTING', False) and
           request.headers['Referer'] != url_for('home', _external=True)):
            abort(401)
        return f(*args, **kwargs)
    return decorated_function


def generate_csrf_token():
    """Generate a CSRF-token and store it in a session variable for later
    retrieval.
    """
    if 'csrf' not in session:
        session['csrf'] = str(uuid4())
    return session['csrf']
