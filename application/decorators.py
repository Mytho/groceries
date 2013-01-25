# -*- coding: utf-8 -*-
"""
    APPLICATION.DECORATORS
    ----------------------
    Decorate view functions with common functionality.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from datetime import datetime, timedelta
from functools import wraps


def content_type(content_type='text/plain'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = f(*args, **kwargs)
            response.headers['Content-Type'] = content_type
            return response
        return decorated_function
    return decorator

def cache_control(seconds=86400):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            expires = datetime.utcnow() + timedelta(seconds=seconds)
            expires = expires.strftime('%a, %d %b %Y %H:%M:%S GMT')
            cache_control = 'public, max-age=%s' % str(seconds)
            response = f(*args, **kwargs)
            response.headers['Cache-Control'] = cache_control
            response.headers['Expires'] = expires
            return response
        return decorated_function
    return decorator
