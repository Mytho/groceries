class APP.Collection.Grocery extends Backbone.Collection
  model: APP.Model.Item
  url: '/items'
  comparator: (item) -> item.get('bought_date')
