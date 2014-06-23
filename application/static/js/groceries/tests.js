'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));

    describe('listController', function () {
        var $httpBackend, $timeout, itemService, listController, boughtItem, unboughtItem, scope, ItemModel;

        beforeEach(function () {
            inject(function ($controller, _$timeout_, _$httpBackend_, _itemService_, _ItemModel_) {
                ItemModel = _ItemModel_;
                unboughtItem = new ItemModel({
                    id: 1,
                    name: 'Apples',
                    created_by: null,
                    created_date: 1300000000
                });
                boughtItem = new ItemModel({
                    id: 1,
                    name: 'Apples',
                    created_by: null,
                    created_date: 1300000000,
                    bought_by: null,
                    bought_date: 1400000000
                });
                $timeout = _$timeout_;
                $httpBackend = _$httpBackend_;
                $httpBackend.whenGET('/items').respond([new ItemModel({id: 141, name: 'Bananas'})]);
                $httpBackend.whenPOST('/items').respond(unboughtItem);
                $httpBackend.whenDELETE('/items/'+unboughtItem.id).respond(200, '');
                $httpBackend.whenPUT('/items/'+unboughtItem.id).respond(boughtItem);
                $httpBackend.whenGET('/suggestions').respond([new ItemModel({id: 535, name: 'Lemons'})]);
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

        it('should contain an empty input', function () {
            expect(scope.inputValue).toBe('');
        });

        it('should not display the buttons', function () {
            expect(scope.visibleButtons instanceof Array).toBe(true);
            expect(scope.visibleButtons.length).toBe(0);
        });

        it('should toggle buttons', function () {
            var itemOne = {id: 1},
                itemTwo = {id: 2};
            scope.toggleButton(itemOne);
            scope.toggleButton(itemTwo);
            scope.toggleButton(itemOne);
            expect(scope.visibleButtons).toEqual([2]);
        });

        it('should check button visibility', function () {
            var item = {id: 1};
            expect(scope.isButtonVisible(item)).toBe(false);
            scope.toggleButton(item);
            expect(scope.isButtonVisible(item)).toBe(true);
        });

        it('should add items', function () {
            var item;
            scope.inputValue = 'SomeMockValue';
            scope.inputFocused = true;
            scope.add(unboughtItem.name);
            $httpBackend.flush();
            item = scope.groceries.pop();
            expect(scope.inputValue).toBe('');
            expect(scope.inputFocused).toBe(false);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should add item with name equal to value of input when enter is pressed', function () {
            var e, item;
            e = {
                keyCode: 13,
                target: {
                    blur: function () {}
                }
            };
            scope.inputFocused = true;
            scope.inputValue = unboughtItem.name;
            scope.keyup(e);
            $httpBackend.flush();
            item = scope.groceries.pop();
            $timeout.flush();
            expect(item.name).toBe(unboughtItem.name);
            expect(scope.inputFocused).toBe(false);
        });

        it('should delete items', function () {
            var e, item;
            e = {
                stopPropagation: function () {}
            };
            scope.groceries.push(unboughtItem);
            expect(scope.groceries.indexOf(unboughtItem)).toBe(scope.groceries.length - 1);
            scope.delete(unboughtItem, e);
            $httpBackend.flush();
            expect(scope.groceries.indexOf(unboughtItem)).toBe(-1);
        });

        it('should mark items as bought', function () {
            var e = {
                stopPropagation: function () {}
            };
            scope.groceries.push(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.buy(unboughtItem, e);
            $httpBackend.flush();
            expect(unboughtItem.bought_date).not.toBe(null);
        });

        it('should toggle input focus', function () {
            expect(scope.inputFocused).toBe(false);
            scope.toggleFocus();
            $timeout.flush();
            expect(scope.inputFocused).toBe(true);
            scope.toggleFocus();
            $timeout.flush();
            expect(scope.inputFocused).toBe(false);
        });
    });
});
