class APP.GroceryView extends Backbone.View
  el: $('ul#grocery-list')
  initialize: ->
    @render()
  render: ->
    $(@el).append('<li>Sample item</li>')
