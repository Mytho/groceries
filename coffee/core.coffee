$ = jQuery
doc = document
win = window
APP =
  Model: {}
  View: {}
  Collection: {}


APP.init = ->
  APP.groceryList = new APP.Collection.Grocery
  APP.groceryView = new APP.View.Grocery
