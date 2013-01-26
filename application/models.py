# -*- coding: utf-8 -*-
"""
    APPLICATION.MODELS
    ------------------
    Models for the database objects.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app

from flask.ext.sqlalchemy import SQLAlchemy


db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(64))

    # TODO: Add relationships

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

    def is_authenticated(self):
        # TODO: Add proper check
        # http://packages.python.org/Flask-Login/
        return True

    def is_active(self):
        # TODO: Add property to the database
        # http://packages.python.org/Flask-Login/
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    create_date = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    bought_date = db.Column(db.Integer)
    bought_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    # TODO: Add relationships

    def __init(self, name):
        self.name = name

    def __repr__(self):
        return '<Item %r>' % self.name
