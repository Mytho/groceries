class APP.View.Grocery extends Backbone.View
  el: $('div#content')
  groceries: $("ul#groceries")
  input: $('input#new-item')
  suggestions: $('ul#suggestions')
  events:
    'focusin input#new-item': 'onFocusIn'
    'focusout input#new-item': 'onFocusOut'
    'keyup input#new-item': 'onKeyUp'
  addAll: ->
    APP.groceries.each @addOne, @
  addOne: (item) ->
    view = new APP.View.Item model: item
    $(@el).find('ul#groceries').append view.render().el
  create: ->
    APP.groceries.create name: @input.val()
    @input.val('')
    @groceries.show()
    @suggestions.hide()
  initialize: ->
    APP.groceries = new APP.Collection.Grocery
    APP.suggestions = new APP.Collection.Suggestion
    @listenTo(APP.groceries, 'add', @addOne)
    @listenTo(APP.groceries, 'reset', @addAll)
    APP.groceries.fetch()
    APP.suggestions.fetch()
  onFocusIn: ->
    @suggest()
  onFocusOut: ->
    at = @
    APP.timeoutId = win.setTimeout(->
      at.suggest()
    , 250)
  onKeyUp: (e) ->
    @create() if e.keyCode is 13 and @input.val() isnt ''
    @suggest() if e.keyCode isnt 13
  suggest: ->
    at = @
    @suggestions.html('').show()
    APP.suggestions.like @input.val() if @input.is(':focus')
    APP.suggestions.clear() if not @input.is(':focus') and @input.val() is ''
    _.each APP.suggestions.filtered.slice(0, 10), (suggestion) ->
      view = new APP.View.Suggestion model: suggestion
      $(at.suggestions).append view.render().el
    @groceries.toggle(not @input.is(':focus') and @input.val() is '')


class APP.View.Item extends Backbone.View
  tagName: 'li'
  events:
    'click': 'toggleDeleteButton'
    'click label': 'toggleBought'
    'click .buy': 'toggleBought'
    'click .delete': 'delete'
  delete: ->
    @model.destroy()
  initialize: ->
    @template = _.template $('#item-template').html()
    @listenTo(@model, 'change', @render)
    @listenTo(@model, 'destroy', @remove)
  render: ->
    $(@el).html @template @model.toJSON()
    $(@el).find('.delete').hide()
    @
  toggleDeleteButton: ->
    $(@el).find('.delete').toggle()
  toggleBought: (e) ->
    $(@el).toggleClass 'bought'
    @model.toggle()
    e.stopPropagation()


class APP.View.Suggestion extends Backbone.View
  tagName: 'li'
  events:
    'click': 'addItem'
  addItem: ->
    win.clearTimeout(APP.timeoutId)
    APP.groceries.create name: @model.get('name')
    $("ul#suggestions").hide()
    $("ul#groceries").show()
    $("input#new-item").val('')
  initialize: ->
    @template = _.template $('#suggestion-template').html()
  render: ->
    $(@el).html @template @model.toJSON()
    @
