class APP.View.Grocery extends Backbone.View
  el: $('ul#grocery-list')
  addAll: -> APP.groceryList.each @addOne, @
  addOne: (item) ->
    view = new APP.View.Item model: item
    $('ul#grocery-list').append view.render().el
  initialize: ->
    @listenTo(APP.groceryList, 'add', @addOne)
    @listenTo(APP.groceryList, 'reset', @addAll)
    @listenTo(APP.groceryList, 'all', @render)
    APP.groceryList.fetch()
  render: ->
    @


class APP.View.Item extends Backbone.View
  tagName: 'li'
  render: ->
    $(@el).html @model.get('name')
    @
