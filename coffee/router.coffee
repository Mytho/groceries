class APP.Router extends Backbone.Router
  routes:
    "": "home"
  home: ->
    APP.groceryList = new APP.Collection.Grocery
    APP.suggestions = new APP.Collection.Suggestion
    APP.groceryView = new APP.View.Grocery
