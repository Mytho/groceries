# -*- coding: utf-8 -*-
"""
    APPLICATION.AUTH
    ----------------
    Responsible for authenticating users.

    Copyright (c) 2013 T. Zengerink
    Licensed under MIT License.
    See: https://raw.github.com/Mytho/groceries/master/LISENCE.md
"""
from application import app
from models import User

from flask import make_response, redirect, render_template, request, url_for
from flask.ext.login import LoginManager, login_user, logout_user, \
                            login_required
from werkzeug.security import check_password_hash


login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if check_password_hash(user.password, request.form['password']):
            login_user(user)
            return redirect(url_for('home'))
    return make_response(render_template('login.html'))

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
