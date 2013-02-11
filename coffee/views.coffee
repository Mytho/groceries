class APP.View.Grocery extends Backbone.View
  el: $('div#content')
  groceries: $("ul#groceries")
  input: $('input#new-item')
  suggestions: $('ul#suggestions')
  events:
    'keyup input#new-item': 'createOnEnter'
  addAll: ->
    APP.groceryList.each @addOne, @
  addOne: (item) ->
    view = new APP.View.Item model: item
    $(@el).find('ul#groceries').append view.render().el
  createOnEnter: (e) ->
    @renderSuggestions()
    return if e.keyCode isnt 13 or @input.val() is ''
    APP.groceryList.create name: @input.val()
    @groceries.show()
    @input.val('')
  initialize: ->
    APP.groceryList = new APP.Collection.Grocery
    APP.suggestions = new APP.Collection.Suggestion
    @listenTo(APP.groceryList, 'add', @addOne)
    @listenTo(APP.groceryList, 'reset', @addAll)
    APP.groceryList.fetch()
    APP.suggestions.fetch()
  renderSuggestions: ->
    at = @
    @suggestions.html('').show()
    APP.suggestions.like @input.val() if @input.val() isnt ''
    APP.suggestions.clear() if @input.val() is ''
    _.each APP.suggestions.filtered, (suggestion) ->
      view = new APP.View.Suggestion model: suggestion
      $(at.suggestions).append view.render().el
    @groceries.hide() if APP.suggestions.filtered.length
    @groceries.show() if @input.val() is ''


class APP.View.Item extends Backbone.View
  tagName: 'li'
  events:
    'click': 'toggleDeleteButton'
    'click label': 'toggleBought'
    'click .bought': 'toggleBought'
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
    @model.toggle()
    e.stopPropagation()


class APP.View.Suggestion extends Backbone.View
  tagName: 'li'
  events:
    'click': 'addItem'
  addItem: ->
    APP.groceryList.create name: @model.get('name')
    $("ul#suggestions").hide()
    $("ul#groceries").show()
    $("input#new-item").val('')
  initialize: ->
    @template = _.template $('#suggestion-template').html()
  render: ->
    $(@el).html @template @model.toJSON()
    @
