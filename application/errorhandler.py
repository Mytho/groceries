# -*- coding: utf-8 -*-
"""
    APPLICATION.ERRORHANDLER
    ------------------------
    Handle application errors and show user friendly error pages.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app
from flask import render_template


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
