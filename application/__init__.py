# -*- coding: utf-8 -*-
"""
    APPLICATION
    -----------
    Initialize the core environment for the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import render_template, Flask
from .auth import init_auth
from .models import init_models
from .views import FaviconView, HomeView, ItemView, SuggestionView


app = Flask(__name__)
app.config.from_object('application.config')
init_auth(app)
init_models(app)


@app.errorhandler(400)
def bad_request(e):
    return render_template('error/400.html'), 400


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


app.add_url_rule('/', view_func=HomeView.as_view('home'))
app.add_url_rule('/favicon.ico', view_func=FaviconView.as_view('favicon'))
app.add_url_rule('/items', view_func=ItemView.as_view('items'))
app.add_url_rule('/items/<item_id>', view_func=ItemView.as_view('spec_items'))
app.add_url_rule('/suggestions',
                 view_func=SuggestionView.as_view('suggestions'))
