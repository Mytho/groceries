'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));
});

describe('Groceries.listController', function () {
    var listController;

    beforeEach(function () {
        module('Groceries.listController');

        module(function ($provide) {
            $provide.value('itemService', {
                // TODO: Mock service methods here..
            });
        });

        inject(function ($controller, $timeout, _itemService_) {
            var scope = {};

            listController = $controller('listController', {
                $scope: scope,
                $timeout: $timeout,
                itemService: _itemService_
            });
        });
    });


    it('should exist in the Groceries module', function () {
        expect( !! listController).toBe(true);
    });
});
