# -*- coding: utf-8 -*-
"""
    APPLICATION
    -----------
    Initialize the core environment for the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from flask import Flask
from .auth import init_auth
from .errors import init_errors
from .models import init_models
from .security import init_security
from .views import FaviconView, GroceriesView, ItemView, SuggestionView


app = Flask(__name__, static_folder='../static')
app.config.from_object('application.config')
init_auth(app)
init_errors(app)
init_models(app)
init_security(app)


app.add_url_rule('/', view_func=GroceriesView.as_view('home'))
app.add_url_rule('/favicon.ico', view_func=FaviconView.as_view('favicon'))
app.add_url_rule('/items', view_func=ItemView.as_view('items'))
app.add_url_rule('/items/<item_id>', view_func=ItemView.as_view('spec_items'))
app.add_url_rule('/suggestions',
                 view_func=SuggestionView.as_view('suggestions'))
