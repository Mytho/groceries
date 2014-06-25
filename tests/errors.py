# -*- coding: utf-8 -*-
"""
    TESTS.ERRORS
    ------------
    Testing application errors.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import unittest
from flask import render_template
from application import app


class ErrorsTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_error_handlers(self):
        with app.app_context():
            self.assertTrue(400 in app.error_handler_spec[None])
            self.assertTrue(401 in app.error_handler_spec[None])
            self.assertTrue(404 in app.error_handler_spec[None])
            self.assertTrue(500 in app.error_handler_spec[None])

    def test_404(self):
        response = self.client.get('/non-existing-page')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.headers['Content-Type'],
                         'text/html; charset=utf-8')
        self.assertTrue('Page not found' in response.data)
