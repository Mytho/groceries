$ = jQuery
doc = document
win = window
APP =
  Model: {}
  View: {}
  Collection: {}


APP.ajaxErrorHandler = (e, xhr) ->
    win.location = "login" if xhr.status is 401

APP.init = ->
  $(doc).ajaxError(APP.ajaxErrorHandler)
  APP.groceryList = new APP.Collection.Grocery
  APP.groceryView = new APP.View.Grocery
