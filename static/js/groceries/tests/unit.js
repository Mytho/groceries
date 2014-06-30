'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));

    describe('ItemModel', function () {
        var ItemModel;

        beforeEach(inject(function (_ItemModel_) {
            ItemModel = _ItemModel_;
        }));

        it('should extend default values', function () {
            var item = new ItemModel({
                id: 123,
                name: 'Oranges'
            });
            expect(typeof item.id).not.toBe('undefined');
            expect(typeof item.name).toBe('string');
            expect(typeof item.bought_by).not.toBe('undefined');
            expect(typeof item.bought_date).not.toBe('undefined');
            expect(typeof item.created_by).not.toBe('undefined');
            expect(typeof item.created_date).not.toBe('undefined');
            expect(typeof item.isBought).toBe('function');
            expect(typeof item.update).toBe('function');
        });

        it('should tell if it is bought or not', function () {
            var itemOne, itemTwo, itemThree, itemFour;
            itemOne = new ItemModel({
                bought_by: null,
                bought_date: null
            });
            itemTwo = new ItemModel({
                bought_by: 1,
                bought_date: null
            });
            itemThree = new ItemModel({
                bought_by: null,
                bought_date: 1300000000
            });
            itemFour = new ItemModel({
                bought_by: 1,
                bought_date: 1300000000
            });
            expect(itemOne.isBought()).toBe(false);
            expect(itemTwo.isBought()).toBe(true);
            expect(itemThree.isBought()).toBe(true);
            expect(itemFour.isBought()).toBe(true);
        });

        it('should update it\'s data', function () {
            var item = new ItemModel({
                id: 123,
                name: 'Apples'
            });
            expect(item.bought_by).toBe(null);
            item.update({ bought_by: 789 });
            expect(item.bought_by).toBe(789);
        });
    });

    describe('ItemService', function () {
        var $httpBackend, ItemModel, ItemService;

        beforeEach(inject(function (_$httpBackend_, _ItemModel_, _ItemService_) {
            $httpBackend = _$httpBackend_;
            ItemModel = _ItemModel_;
            ItemService = _ItemService_;
        }));

        it('should return a list of ItemModels as groceries', function () {
            var groceries = [];
            $httpBackend.whenGET('/items').respond([{id: 1, name: 'Apples'}, {id: 2, name: 'Bananas'}]);
            ItemService.getGroceries().then(function (items) {
                groceries = items;
            });
            $httpBackend.flush();
            expect(groceries instanceof Array).toBe(true);
            expect(groceries.length).toBe(2);
        });

        it('should return a list of ItemModels as suggestions', function () {
            var suggestions = [];
            $httpBackend.whenGET('/suggestions').respond([{id: 1, name: 'Apples'}, {id: 2, name: 'Bananas'}]);
            ItemService.getSuggestions().then(function (items) {
                suggestions = items;
            });
            $httpBackend.flush();
            expect(suggestions instanceof Array).toBe(true);
            expect(suggestions.length).toBe(2);
        });

        it('should add items', function () {
            var item, testName;
            testName = 'Oranges';
            $httpBackend.whenPOST('/items').respond({id: 123, name: testName});
            ItemService.addItem(testName).then(function (_item_) {
                item = _item_;
            });
            $httpBackend.flush();
            expect(item.name).toBe(testName);
        });

        it('should delete items', function () {
            var itemId, isSuccessful;
            itemId = 1;
            $httpBackend.whenDELETE('/items/'+itemId).respond(200, '');
            ItemService.deleteItem(itemId).then(function (_isSuccessful_) {
                isSuccessful = _isSuccessful_;
            });
            $httpBackend.flush();
            expect(isSuccessful).toBe(true);
        });

        it('should toggle items bought data', function () {
            var item, testName;
            item = new ItemModel({name: testName});
            $httpBackend.whenPUT('/items/'+item.id).respond({name: testName, bought_date: 1300000000, bought_by: 3});
            ItemService.toggleItem(item.id, {bought: true}).then(function (_item_) {
                item = _item_;
            });
            $httpBackend.flush();
            expect(item.isBought()).toBe(true);
        });
    });

    describe('ListController', function () {
        var $httpBackend, $timeout, ItemModel, ItemService, ListController,
            boughtItem, mockEvent, unboughtItem, scope;

        beforeEach(function () {
            inject(function ($controller, _$timeout_, _$httpBackend_, _ItemService_, _ItemModel_) {
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
                mockEvent = {
                    keyCode: 13,
                    target: {
                        blur: function () {},
                        focus: function () {}
                    },
                    preventDefault: function () {},
                    stopPropagation: function () {}
                };
                scope = {};
                ItemService = _ItemService_;
                ListController = $controller('ListController', {
                    $scope: scope,
                    $timeout: $timeout,
                    ItemService: ItemService
                });
                $httpBackend.flush();
            });
        });

        it('should exist', function () {
            expect( !! ListController).toBe(true);
        });

        it('should set the list of groceries', function () {
            expect(scope.groceries instanceof Array).toBe(true);
            expect(scope.groceries.length).toBeGreaterThan(0);
            scope.groceries = [];
            scope.setGroceries();
            $httpBackend.flush();
            expect(scope.groceries instanceof Array).toBe(true);
            expect(scope.groceries.length).toBeGreaterThan(0);
        });

        it('should set the list of suggestions', function () {
            expect(scope.suggestions instanceof Array).toBe(true);
            expect(scope.suggestions.length).toBeGreaterThan(0);
            scope.suggestions = [];
            scope.setSuggestions();
            $httpBackend.flush();
            expect(scope.suggestions instanceof Array).toBe(true);
            expect(scope.suggestions.length).toBeGreaterThan(0);
        });

        it('should initialize with an empty input', function () {
            expect(scope.inputValue).toBe('');
        });

        it('should add items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.setSuggestions = function () {
                calledSetSuggestions = true;
            };
            scope.inputValue = 'SomeMockValue';
            scope.inputFocused = true;
            scope.add(mockEvent, unboughtItem.name);
            $httpBackend.flush();
            item = scope.groceries.pop();
            expect(scope.inputValue).toBe('');
            expect(scope.inputFocused).toBe(false);
            expect(calledSetSuggestions).toBe(true);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should add item with name equal to value of input when enter is pressed and value is not empty', function () {
            var item, lengthAtStart;
            lengthAtStart = scope.groceries.length;
            scope.inputFocused = true;
            scope.inputValue = '';
            scope.keyup(mockEvent);
            scope.inputValue = unboughtItem.name;
            scope.keyup(mockEvent);
            $httpBackend.flush();
            $timeout.flush();
            expect(scope.groceries.length).toBe(lengthAtStart + 1);
            item = scope.groceries.pop();
            expect(item.name).toBe(unboughtItem.name);
            expect(scope.inputFocused).toBe(false);
        });

        it('should schedule items for deletion', function () {
            expect(scope.deleteSchedule).toEqual({});
            scope.scheduleDelete(mockEvent, unboughtItem, 3500);
            expect(scope.deleteSchedule.hasOwnProperty(unboughtItem.id)).toBe(true);
            $timeout.flush();
            $httpBackend.flush();
            expect(scope.deleteSchedule.hasOwnProperty(unboughtItem.id)).toBe(false);
        });

        it('should cancel scheduled deletes', function () {
            expect(scope.deleteSchedule).toEqual({});
            scope.scheduleDelete(mockEvent, unboughtItem, 3500);
            expect(scope.deleteSchedule.hasOwnProperty(unboughtItem.id)).toBe(true);
            scope.cancelDelete(mockEvent, unboughtItem);
            $timeout.flush();
            expect(scope.deleteSchedule.hasOwnProperty(unboughtItem.id)).toBe(false);
        });

        it('should delete items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.setSuggestions = function () {
                calledSetSuggestions = true;
            };
            scope.groceries.push(unboughtItem);
            expect(scope.groceries.indexOf(unboughtItem)).toBe(scope.groceries.length - 1);
            scope.delete(unboughtItem);
            $httpBackend.flush();
            expect(calledSetSuggestions).toBe(true);
            expect(scope.groceries.indexOf(unboughtItem)).toBe(-1);
        });

        it('should mark items as bought', function () {
            scope.groceries.push(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.buy(mockEvent, unboughtItem);
            $httpBackend.flush();
            expect(unboughtItem.bought_date).not.toBe(null);
        });

        it('should not mark items as bought when the item is scheduled for deletion', function () {
            scope.groceries.push(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.scheduleDelete(mockEvent, unboughtItem, 3500);
            scope.buy(mockEvent, unboughtItem);
            // Due to `no pending requests to flush` this extra request is added
            scope.add(mockEvent, 'Apples');
            $httpBackend.flush();
            expect(unboughtItem.bought_date).toBe(null);
        });

        it('should toggle input focus', function () {
            expect(scope.inputFocused).toBe(false);
            scope.toggleFocus(mockEvent);
            $timeout.flush();
            expect(scope.inputFocused).toBe(true);
            scope.toggleFocus(mockEvent);
            $timeout.flush();
            expect(scope.inputFocused).toBe(false);
        });

        it('should remove input focus', function () {
            expect(scope.inputFocused).toBe(false);
            scope.toggleFocus(mockEvent);
            expect(scope.inputFocused).toBe(true);
            scope.removeFocus();
            $timeout.flush();
            expect(scope.inputFocused).toBe(false);
        });
    });
});
