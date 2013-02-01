class APP.View.Grocery extends Backbone.View
  el: $('div#content')
  events:
    'keypress input#new-item': 'createOnEnter'
  input: $('input#new-item')
  addAll: -> APP.groceryList.each @addOne, @
  addOne: (item) ->
    view = new APP.View.Item model: item
    $(@el).find('ul').append view.render().el
  createOnEnter: (e) ->
    return if e.keyCode != 13 or @input.val() == ''
    APP.groceryList.create name: @input.val()
    @input.val('')
  initialize: ->
    @listenTo(APP.groceryList, 'add', @addOne)
    @listenTo(APP.groceryList, 'reset', @addAll)
    APP.groceryList.fetch()


class APP.View.Item extends Backbone.View
  tagName: 'li'
  events:
    'click': 'toggleDeleteButton'
    'click label': 'toggleBought'
    'click .bought': 'toggleBought'
    'click .delete': 'delete'
  delete: -> @model.destroy()
  initialize: ->
    @template = _.template($("#item-template").html())
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
