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
import os
import sys
import unittest

sys.path.append(os.abspath('.'))

from tests.app import AppTestCase  # NOQA
from tests.auth import AuthTestCase  # NOQA
from tests.decorators import DecoratorsTestCase  # NOQA
from tests.errors import ErrorsTestCase  # NOQA
from tests.models import ItemTestCase, UserTestCase  # NOQA


if __name__ == '__main__':
    unittest.main()
