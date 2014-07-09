# -*- coding: utf-8 -*-
"""
    APPLICATION.MODELS
    ------------------
    Models used to store groceries in the database.

    Copyright (c) 2014 Teun Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
import time
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import desc, func


db = SQLAlchemy()


def init_models(app):
    """Initialize the module by binding the db to the current application.

    app -- application to bind db to
    """
    db.init_app(app)


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    create_date = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    bought_date = db.Column(db.Integer)
    bought_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    created_user = db.relationship('User',
                                   backref=db.backref('created_items',
                                                      lazy='dynamic'),
                                   foreign_keys=[created_by])

    bought_user = db.relationship('User',
                                  backref=db.backref('bought_items',
                                                     lazy='dynamic'),
                                  foreign_keys=[bought_by])

    def __init__(self, name, user):
        """Create a new Item instance.

        name -- name of the item
        user -- creator of the item
        """
        self.name = name
        self.create_date = time.time()
        self.created_by = user.get_id()
        self.bought_date = None
        self.bought_by = None

    def __repr__(self):
        return '<Item %r>' % self.name

    @staticmethod
    def suggestions(limit=20):
        """Returns a list of suggestions"""
        return db.session \
            .query(Item.name, func.count(Item.name).label('count')) \
            .group_by(Item.name) \
            .order_by(desc('count')) \
            .limit(limit) \
            .all()

    def buy(self, user, is_bought=True):
        """Mark the item as bought.

        user      -- buyer of the item
        is_bought -- is item bought?
        """
        if is_bought:
            self.bought_by = user.get_id()
            self.bought_date = time.time()
        else:
            self.bought_by = None
            self.bought_date = None
        return self

    def delete(self):
        """Delete the item from the list."""
        db.session.delete(self)
        db.session.commit()
        return self

    def save(self):
        """Saves an item to the list."""
        db.session.add(self)
        db.session.commit()
        return self

    def serialize(self):
        """Serializes the item for proper JSON-responses."""
        return {'id': self.id,
                'name': self.name,
                'create_date': self.create_date,
                'created_by': self.created_by,
                'bought_date': self.bought_date,
                'bought_by': self.bought_by}


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
