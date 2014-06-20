# -*- coding: utf-8 -*-
"""
    APPLICATION.ERRORS
    ------------------
    Show userfriendly error pages.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import render_template


def bad_request(e):
    return render_template('error/400.html'), 400


def unauthorized(e):
    return render_template('error/403.html'), 401


def not_found(e):
    return render_template('error/404.html'), 404


def internal_error(e):
    return render_template('error/500.html'), 500


def init_errors(app):
    app.error_handler_spec[None][400] = bad_request
    app.error_handler_spec[None][401] = unauthorized
    app.error_handler_spec[None][404] = not_found
    app.error_handler_spec[None][500] = internal_error
