'use strict';

var Groceries = angular.module('Groceries', ['ngTouch', 'ngAnimate']);

Groceries.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
}]);
