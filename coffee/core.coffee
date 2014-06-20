# CORE
# ----
# Core of the application.
#
# Copyright (c) 2014 Teun Zengerink
# Licensed under MIT License.
# See: https://raw.github.com/Mytho/groceries/master/LISENCE.md

$ = jQuery
doc = document
win = window

win.APP =
  Model: {}
  View: {}
  Collection: {}
  timeoutId: null
  focused: null
  ajaxErrorHandler: (e, xhr) ->
    win.location = 'login' if xhr.status is 401
  init: ->
    $(doc).ajaxError APP.ajaxErrorHandler
    APP.router = new APP.Router
    Backbone.history.start pushState: true
    setTimeout(->
      win.scrollTo 0, 1
    , 100)
