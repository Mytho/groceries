#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    USER MANAGEMENT
    ---------------
    Simple script to create new users.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import getpass
import sqlite3
from werkzeug import generate_password_hash


def main():
    print('Creating a new user.')
    user = username()
    passwd = password()
    conn = sqlite3.connect('db/groceries.db')
    conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                 [user, passwd])
    conn.commit()
    print('New user created.')


def password():
    password = getpass.getpass('Password: ')
    password_check = getpass.getpass('Confirm password: ')
    while not password == password_check:
        print('Password do not match.')
        password = getpass.getpass('Password: ')
        password_check = getpass.getpass('Confirm password: ')
    return generate_password_hash(password)


def username():
    return raw_input('Username: ')


if __name__ == '__main__':
    main()
