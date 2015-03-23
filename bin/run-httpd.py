#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    DEVELOPMENT SERVER
    ------------------
    Simple development server.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import os
import sys

sys.path.append(os.path.abspath('.'))

from application import app


def main():
    app.run(host='0.0.0.0', port=8001, debug=app.config['DEBUG'])


if __name__ == "__main__":
    main()
