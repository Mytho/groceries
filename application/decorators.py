# -*- coding: utf-8 -*-
"""
    APPLICATION.DECORATORS
    ----------------------
    Decorate view functions with common functionality.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from datetime import datetime, timedelta
from functools import wraps


def content_type(content_type='text/plain'):
    """Wrap a function that returns a response and add the specified
    content-type to the headers of the response.

    content_type -- content type of the response
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = f(*args, **kwargs)
            response.headers['Content-Type'] = content_type
            return response
        return decorated_function
    return decorator


def cache_control(seconds=86400):
    """Wraps a function that returns a response and add the specified
    cache-control to the headers of the response.

    seconds -- number of seconds to cache the response
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            format = '%a, %d %b %Y %H:%M:%S GMT'
            cache_control = 'public, max-age=%s' % str(seconds)
            expires = datetime.utcnow() + timedelta(seconds=seconds)
            last_modified = datetime.utcnow() - timedelta(seconds=seconds)
            response = f(*args, **kwargs)
            response.headers['Cache-Control'] = cache_control
            response.headers['Expires'] = expires.strftime(format)
            response.headers['Last-Modified'] = last_modified.strftime(format)
            return response
        return decorated_function
    return decorator
