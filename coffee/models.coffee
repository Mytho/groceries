class APP.Model.Item extends Backbone.Model
  initialize: ->
    @set('bought', @get('bought_by') or @get('bought_date'))
  toggle: ->
    @save bought: not @get('bought')


class APP.Model.Suggestion extends Backbone.Model
