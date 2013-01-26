class APP.GroceryView extends Backbone.View
  el: $('ul#grocery-list')
  addItem: (item) ->
    view = new APP.ItemView model: item
    $('ul#grocery-list').append view.render().el
  initialize: ->
    @groceryCollection = new APP.GroceryCollection()
    @groceryCollection.bind 'add', @addItem
    @render()
  render: ->
    $(@el).append('<li>Sample item</li>')


class APP.ItemView extends Backbone.View
  tagName: 'li'
  render: ->
    $(@el).html @model.get('name')
    @
