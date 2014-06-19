# -*- coding: utf-8 -*-
import json
import unittest
from application import app


class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_favicon(self):
        response = self.client.get('favicon.ico')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'],
                         'image/vnd.microsoft.icon')

    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'],
                         'text/html; charset=utf-8')

    def test_delete_items(self):
        post_data = '{"name":"oranges"}'
        post_response = self.client.post('/items', data=post_data)
        id = json.loads(post_response.data).get('id')
        self.assertTrue(id)
        delete_response = self.client.delete('/items/%s' % id)
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(delete_response.headers['Content-Type'],
                         'application/json')
        put_response = self.client.post('/items%s' % id)
        self.assertTrue(put_response.status_code, 404)

    def test_get_items(self):
        response = self.client.get('/items')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'], 'application/json')

    def test_post_items(self):
        item_name = 'Toiletpaper'
        data = '{"name":"%s"}' % item_name
        response = self.client.post('/items', data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'], 'application/json')
        self.assertEqual(json.loads(response.data).get('name'), item_name)

    def test_put_items(self):
        post_data = '{"name":"Oranges"}'
        post_response = self.client.post('/items', data=post_data)
        self.assertFalse(json.loads(post_response.data).get('bought_date'))
        id = json.loads(post_response.data).get('id')
        put_data = '{"bought":true}'
        put_response = self.client.put('/items/%s' % id, data=put_data)
        self.assertEqual(put_response.status_code, 200)
        self.assertEqual(put_response.headers['Content-Type'],
                         'application/json')
        self.assertTrue(json.loads(put_response.data).get('bought_date'))

    def test_suggestions(self):
        response = self.client.get('suggestions')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Type'], 'application/json')
