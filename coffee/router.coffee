# ROUTER
# ------
# Routing client side pages and connecting them to actions and events.
#
# Copyright (c) 2014 Teun Zengerink
# Licensed under MIT License.
# See: https://raw.github.com/Mytho/groceries/master/LISENCE.md

class APP.Router extends Backbone.Router
  routes:
    '': 'home'
  home: ->
    APP.groceryView = new APP.View.Grocery
