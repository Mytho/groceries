# -*- coding: utf-8 -*-
"""
    APPLICATION.CONFIG
    ------------------
    Configuration of the application.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
ADMINS = ['teun@zengerink.com']
DEBUG = False
TESTING = False
SECRET_KEY = 'VerySecretKey'
SESSION_COOKIE_DOMAIN = 'localhost'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_NAME = 'session'
SESSION_COOKIE_PATH = '/'
SESSION_COOKIE_SECURE = False
SQLALCHEMY_DATABASE_URI = 'sqlite:////var/www/path/database.db'
