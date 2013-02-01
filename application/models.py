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
from flask.ext.login import current_user
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import desc, func
from time import time


db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(64))
    active = db.Column(db.Integer)

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

    def is_authenticated(self):
        return True

    def is_active(self):
        return True if self.active else False

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

    def __init__(self, name):
        self.name = name
        self.create_date = time()
        self.created_by = current_user.id
        self.bought_date = None
        self.bought_by = None

    def __repr__(self):
        return '<Item %r>' % self.name

    @staticmethod
    def bought(item_id, bought):
        item = Item.query.get(item_id)
        if bought:
            item.bought_by = current_user.id
            item.bought_date = time()
        else:
            item.bought_by = None
            item.bought_date = None
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def create(name):
        item = Item(name)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def delete(item_id):
        db.session.delete(Item.query.get(item_id))
        db.session.commit()

    @staticmethod
    def suggestions():
        return db.session \
            .query(Item.name, func.count(Item.name).label('count')) \
            .group_by(Item.name) \
            .order_by(desc('count')).all()

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'create_date': self.create_date,
                'created_by': self.created_by,
                'bought_date': self.bought_date,
                'bought_by': self.bought_by}
