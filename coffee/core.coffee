$ = jQuery
doc = document
win = window

APP =
  Model: {}
  View: {}
  Collection: {}
  ajaxErrorHandler: (e, xhr) ->
    win.location = "login" if xhr.status is 401
  init: ->
    $(doc).ajaxError APP.ajaxErrorHandler
    APP.router = new APP.Router
    Backbone.history.start pushState: true
