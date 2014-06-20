# MODELS
# ------
# Interactive data elements and their logic.
#
# Copyright (c) 2014 Teun Zengerink
# Licensed under MIT License.
# See: https://raw.github.com/Mytho/groceries/master/LISENCE.md

class APP.Model.Item extends Backbone.Model
  initialize: ->
    @set('bought', @get('bought_by') or @get('bought_date'))
  toggle: ->
    @save bought: not @get('bought')

class APP.Model.Suggestion extends Backbone.Model
