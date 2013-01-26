class APP.GroceryCollection extends Backbone.Collection
  initialize: -> @fetch()
  model: APP.ItemModel
  url: '/items'
