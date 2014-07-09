# -*- coding: utf-8 -*-
"""
    TESTS.AUTH
    ----------
    Testing application authentication.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import unittest
from application import app


class AuthTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_login(self):
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 302)
        self.assertTrue('/' in response.headers['Location'])

    def test_logout(self):
        response = self.client.get('/logout')
        self.assertEqual(response.status_code, 302)
        self.assertTrue('/login' in response.headers['Location'])
