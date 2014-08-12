# -*- coding: utf-8 -*-
"""
    TESTS.DECORATORS
    ----------------
    Testing application decorators.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import unittest
from flask import make_response
from application import app
from application.decorators import content_type, cache_control


class DecoratorsTestCase(unittest.TestCase):

    @content_type('application/json')
    @cache_control(3600)
    def get_response(self):
        return make_response('Hello, World!')

    def test_content_type(self):
        with app.app_context():
            response = self.get_response()
            self.assertEqual(response.headers['Content-Type'],
                             'application/json')

    def test_cache_control(self):
        with app.app_context():
            response = self.get_response()
            self.assertEqual(response.headers['Cache-Control'],
                             'private, max-age=%s' % 3600)
            self.assertTrue('Expires' in response.headers)
            self.assertTrue('Last-Modified' in response.headers)
