class APP.View.Grocery extends Backbone.View
  el: $('div#grocery-list')
  events:
    'keypress input': 'createOnEnter'
  input: $('input#new-item')
  addAll: ->
    APP.groceryList.each @addOne, @
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
    @listenTo(APP.groceryList, 'all', @render)
    APP.groceryList.fetch()
  render: ->
    @


class APP.View.Item extends Backbone.View
  tagName: 'li'
  events:
    'change .bought': 'toggleBought'
  initialize: ->
    @template = _.template($("#item-template").html())
  render: ->
    $(@el).html @template(@model.toJSON())
    @
  toggleBought: -> @model.toggle()
