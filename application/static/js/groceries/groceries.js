'use strict';

var Groceries = angular.module('Groceries', []);

Groceries.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
}]);
