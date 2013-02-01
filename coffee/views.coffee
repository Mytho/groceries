class APP.View.Grocery extends Backbone.View
  el: $('div#content')
  events:
    'keyup input#new-item': 'createOnEnter'
  input: $('input#new-item')
  addAll: -> APP.groceryList.each @addOne, @
  addOne: (item) ->
    view = new APP.View.Item model: item
    $(@el).find('ul#groceries').append view.render().el
  createOnEnter: (e) ->
    @renderSuggestions()
    return if e.keyCode isnt 13 or @input.val() is ''
    APP.groceryList.create name: @input.val()
    @input.val('')
  initialize: ->
    @listenTo(APP.groceryList, 'add', @addOne)
    @listenTo(APP.groceryList, 'reset', @addAll)
    APP.groceryList.fetch()
    APP.suggestions.fetch()
  renderSuggestions: ->
    APP.suggestions.like @input.val() if @input.val() isnt ''
    APP.suggestions.clear() if @input.val() is ''
    view = new APP.View.Suggestion
    view.render()


class APP.View.Item extends Backbone.View
  tagName: 'li'
  events:
    'click': 'toggleDeleteButton'
    'click label': 'toggleBought'
    'click .bought': 'toggleBought'
    'click .delete': 'delete'
  delete: -> @model.destroy()
  initialize: ->
    @template = _.template $('#item-template').html()
    @listenTo(@model, 'change', @render)
    @listenTo(@model, 'destroy', @remove)
  render: ->
    $(@el).html @template(@model.toJSON())
    $(@el).find('.delete').hide()
    @
  toggleDeleteButton: -> $(@el).find('.delete').toggle()
  toggleBought: (e) ->
    @model.toggle()
    e.stopPropagation()


class APP.View.Suggestion extends Backbone.View
  el: $('ul#suggestions')
  initialize: -> @template = _.template $('#suggestion-template').html()
  render: ->
    at = @
    $(at.el).html('')
    _.each APP.suggestions.filtered, (suggestion) ->
      $("ul#suggestions").append at.template suggestion.toJSON()
    if APP.suggestions.filtered.length
      $("ul#groceries").hide()
    if $("#new-item").val() is ''
      $("ul#groceries").show()
