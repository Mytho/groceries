# -*- coding: utf-8 -*-
import unittest
from application import app


class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_favicon(self):
        response = self.app.get('favicon.ico')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'],
                         'image/vnd.microsoft.icon')
