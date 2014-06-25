#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    TESTS
    -----
    Run entire testsuite.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import unittest
from tests.app import AppTestCase
from tests.auth import AuthTestCase
from tests.decorators import DecoratorsTestCase
from tests.models import ItemTestCase, UserTestCase


if __name__ == '__main__':
    unittest.main()
