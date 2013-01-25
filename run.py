#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    DEVELOPMENT SERVER
    ------------------
    Simple development server.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app


def main():
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])


if __name__ == "__main__":
    main()
