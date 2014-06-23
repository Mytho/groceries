'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));

    describe('listController', function () {
        var $httpBackend, itemService, listController, scope;

        beforeEach(function () {
            inject(function ($controller, $timeout, _$httpBackend_, _itemService_) {
                $httpBackend = _$httpBackend_;
                $httpBackend.whenGET('/items').respond([
                    {'some':'mock'},
                    {'data':'to'},
                    {'test':'functionality'}
                ]);
                $httpBackend.whenGET('/suggestions').respond([
                    {'some':'mock'},
                    {'data':'to'},
                    {'test':'functionality'}
                ]);
                scope = {};
                itemService = _itemService_;
                listController = $controller('listController', {
                    $scope: scope,
                    $timeout: $timeout,
                    itemService: itemService
                });
                $httpBackend.flush();
            });
        });


        it('should exist', function () {
            expect( !! listController).toBe(true);
        });

        it('should contain a list of groceries', function () {
            expect(scope.groceries instanceof Array).toBe(true);
            expect(scope.groceries.length).toBeGreaterThan(0);
        });

        it('should contain a list of suggestions', function () {
            expect(scope.suggestions instanceof Array).toBe(true);
            expect(scope.suggestions.length).toBeGreaterThan(0);
        });

        it('should not focus the input', function () {
            expect(scope.inputFocused).toBe(false);
        });

        it('should not display the buttons', function () {
            expect(scope.visibleButtons instanceof Array).toBe(true);
            expect(scope.visibleButtons.length).toBe(0);
        });
    });
});
