class APP.Router extends Backbone.Router
  routes:
    "": "home"
  home: ->
    APP.groceryView = new APP.View.Grocery
