'use strict';

var Groceries = angular.module('Groceries', ['ngTouch']);

Groceries.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
}]);
