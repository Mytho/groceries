$ = jQuery
doc = document
win = window

win.APP =
  Model: {}
  View: {}
  Collection: {}
  timeoutId: null
  ajaxErrorHandler: (e, xhr) ->
    win.location = "login" if xhr.status is 401
  init: ->
    $(doc).ajaxError APP.ajaxErrorHandler
    APP.router = new APP.Router
    Backbone.history.start pushState: true
    setTimeout(->
      win.scrollTo 0, 1
    , 100)
