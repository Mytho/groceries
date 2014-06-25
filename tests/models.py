# -*- coding: utf-8 -*-
"""
    TESTS.MODELS
    ------------
    Testing application models.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import unittest
from application.models import Item, User


class ItemTestCase(unittest.TestCase):

    def setUp(self):
        user = User('mock-name', 'mock-pass')
        user.id = 123
        self.item = Item('mock-item', user)

    def test_buy(self):
        user = User('mock-name', 'mock-pass')
        user.id = 123
        item = Item('mock-item', user)
        item.buy(user, True)
        self.assertEqual(item.bought_by, user.id)
        self.assertTrue(item.bought_date, not None)

    def test_serialize(self):
        data = {'id': self.item.id,
                'name': self.item.name,
                'create_date': self.item.create_date,
                'created_by': self.item.created_by,
                'bought_date': self.item.bought_date,
                'bought_by': self.item.bought_by}
        self.assertEqual(self.item.serialize(), data)


class UserTestCase(unittest.TestCase):

    def setUp(self):
        self.user = User('mock-name', 'mock-pass')

    def test_is_authenticated(self):
        self.assertTrue(self.user.is_authenticated())

    def test_is_active(self):
        self.user.active = False
        self.assertFalse(self.user.is_active())
        self.user.active = True
        self.assertTrue(self.user.is_active())

    def test_is_anonymous(self):
        self.assertFalse(self.user.is_anonymous())

    def test_get_id(self):
        self.user.id = 123
        self.assertEqual(self.user.id, self.user.get_id())
