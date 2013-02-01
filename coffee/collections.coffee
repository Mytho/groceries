class APP.Collection.Grocery extends Backbone.Collection
  model: APP.Model.Item
  url: '/items'
  comparator: (item) -> item.get('bought_date')


class APP.Collection.Suggestion extends Backbone.Collection
  filtered: []
  model: APP.Model.Suggestion
  url: '/suggestions'
  comparator: (suggestion) -> return -suggestion.get('count')
  clear: -> @filtered = []
  like: (input) ->
    @filtered = @.filter (item) ->
      item.get('name').toLowerCase().indexOf(input.toLowerCase()) isnt -1
