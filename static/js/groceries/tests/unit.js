'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));

    describe('swipeDelete', function () {
        var $httpBackend, $compile, $rootScope, element, mockList, scope, testItem, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$compile_, _ItemModel_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            ItemModel = _ItemModel_;
            scope = $rootScope.$new();
            scope.item = new ItemModel({id: 1, name: 'Apples'});
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/items').respond(mockList);
            $httpBackend.whenGET('/suggestions').respond(mockList);
            element = angular.element('<span swipe-delete="item"></span>');
            $compile(element)(scope);
            element.scope().$apply();
        }));

        it('should initialize the elements', function () {
            expect(element.attr('class')).toMatch(/swipe-delete/);
            expect(element.find('span').attr('class')).toMatch(/swipe-delete-overlay/);
            expect(element.find('label').text()).toBe(scope.item.name);
            expect(element.find('button').text()).toBe('UNDO');
        });
    });

    describe('InputModel', function () {
        var $timeout, InputModel, inputModel, mockEvent, mockValue;

        beforeEach(inject(function (_$timeout_, _InputModel_) {
            $timeout = _$timeout_;
            InputModel = _InputModel_;
            mockEvent = {
                keyCode: 13,
                target: {
                    blur: function () {},
                    focus: function () {}
                },
                preventDefault: function () {},
                stopPropagation: function () {}
            };
            mockValue = '';
            inputModel = new InputModel(function (_value_) {
                mockValue = _value_;
            });
        }));

        it('should initialize with an empty value', function () {
            expect(inputModel.value).toBe('');
        });

        it('should call onEnter method when enter is pressed and value is not empty', function () {
            var testValue = 'Apples';
            inputModel.onKeyup(mockEvent);
            inputModel.value = testValue;
            inputModel.onKeyup(mockEvent);
            $timeout.flush();
            expect(mockValue).toBe(testValue);
            expect(inputModel.isFocused).toBe(false);
        });

        it('should toggle focus', function () {
            expect(inputModel.isFocused).toBe(false);
            inputModel.onFocus(mockEvent);
            $timeout.flush();
            expect(inputModel.isFocused).toBe(true);
            inputModel.onClick(mockEvent);
            expect(inputModel.isFocused).toBe(false);
            inputModel.onClick(mockEvent);
            expect(inputModel.isFocused).toBe(true);
        });
    });

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

    describe('DeleteService', function () {
        var $httpBackend, $timeout, DeleteService, GroceryService, mockItem, mockList, SuggestionService, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _$timeout_, _DeleteService_, _GroceryService_, _SuggestionService_, _ItemModel_) {
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            ItemModel = _ItemModel_;
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            DeleteService = _DeleteService_;
            GroceryService = _GroceryService_;
            SuggestionService = _SuggestionService_;
            mockItem = new ItemModel({id: 1, name: 'Apples'});
            $httpBackend.whenGET('/items').respond(mockList);
            $httpBackend.whenGET('/suggestions').respond(mockList);
            $httpBackend.flush();
        }));

        it('should keep a schedule on what items are to be deleted', function () {
            expect(DeleteService.schedule).toEqual({});
        });

        it('should add items to the schedule', function () {
            var mockItem = new ItemModel({id: 1, name: 'Apples'});
            expect(DeleteService.schedule).toEqual({});
            DeleteService.add(mockItem);
            expect(DeleteService.schedule.hasOwnProperty(mockItem.id)).toBe(true);
        });

        it('should cancel scheduled items', function () {
            DeleteService.add(mockItem);
            expect(DeleteService.schedule.hasOwnProperty(mockItem.id)).toBe(true);
            DeleteService.cancel(mockItem);
            expect(DeleteService.schedule.hasOwnProperty(mockItem.id)).toBe(false);
        });

        it('should delete items', function () {
            var removedId, isUpdated;
            GroceryService.remove = function (item) {
                removedId = item.id;
            };
            SuggestionService.update = function () {
                isUpdated = true;
            };
            $httpBackend.whenDELETE('/items/'+mockItem.id).respond(200, '');
            DeleteService.add(mockItem);
            $timeout.flush();
            $httpBackend.flush();
            expect(removedId).toBe(mockItem.id);
            expect(isUpdated).toBe(true);
            expect(DeleteService.schedule).toEqual({});
        });

        it('should check if items are scheduled', function () {
            expect(DeleteService.isScheduled(mockItem)).toBe(false);
            DeleteService.add(mockItem);
            expect(DeleteService.isScheduled(mockItem)).toBe(true);
        });
    });

    describe('GroceryService', function () {
        var $httpBackend, GroceryService, mockList, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _GroceryService_, _ItemModel_) {
            ItemModel = _ItemModel_;
            GroceryService = _GroceryService_;
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/items').respond(mockList);
            $httpBackend.flush();
        }));

        it('should update the list on instantiation', function () {
            expect(GroceryService.list instanceof Array).toBe(true);
            expect(GroceryService.list.length).toEqual(2);
            expect(GroceryService.list).toEqual(mockList);
        });

        it('should append items to the list', function () {
            var newItem = new ItemModel({id: 3, name: 'Oranges'});
            expect(GroceryService.list.length).toEqual(2);
            expect(GroceryService.list).toEqual(mockList);
            GroceryService.append(newItem);
            mockList.push(newItem);
            expect(GroceryService.list.length).toEqual(3);
            expect(GroceryService.list).toEqual(mockList);
        });

        it('should remove items from the list', function () {
            var removedItem;
            expect(GroceryService.list.length).toEqual(2);
            expect(GroceryService.list).toEqual(mockList);
            removedItem = mockList.pop();
            GroceryService.remove(removedItem);
            expect(GroceryService.list.length).toEqual(1);
            expect(GroceryService.list).toEqual(mockList);
        });

        it('should update the list', function () {
            GroceryService.list = [];
            expect(GroceryService.list).toEqual([]);
            GroceryService.update();
            $httpBackend.flush();
            expect(GroceryService.list).toEqual(mockList);
        });
    });

    describe('HttpService', function () {
        var $httpBackend, ItemModel, HttpService;

        beforeEach(inject(function (_$httpBackend_, _ItemModel_, _HttpService_) {
            $httpBackend = _$httpBackend_;
            ItemModel = _ItemModel_;
            HttpService = _HttpService_;
        }));

        it('should return a list of ItemModels as groceries', function () {
            var groceries = [];
            $httpBackend.whenGET('/items').respond([{id: 1, name: 'Apples'}, {id: 2, name: 'Bananas'}]);
            HttpService.getGroceries().then(function (items) {
                groceries = items;
            });
            $httpBackend.flush();
            expect(groceries instanceof Array).toBe(true);
            expect(groceries.length).toBe(2);
        });

        it('should return a list of ItemModels as suggestions', function () {
            var suggestions = [];
            $httpBackend.whenGET('/suggestions').respond([{id: 1, name: 'Apples'}, {id: 2, name: 'Bananas'}]);
            HttpService.getSuggestions().then(function (items) {
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
            HttpService.addItem(testName).then(function (_item_) {
                item = _item_;
            });
            $httpBackend.flush();
            expect(item.name).toBe(testName);
        });

        it('should delete items', function () {
            var itemId, isSuccessful;
            itemId = 1;
            $httpBackend.whenDELETE('/items/'+itemId).respond(200, '');
            HttpService.deleteItem(itemId).then(function (_isSuccessful_) {
                isSuccessful = _isSuccessful_;
            });
            $httpBackend.flush();
            expect(isSuccessful).toBe(true);
        });

        it('should toggle items bought data', function () {
            var item, testName;
            item = new ItemModel({name: testName});
            $httpBackend.whenPUT('/items/'+item.id).respond({name: testName, bought_date: 1300000000, bought_by: 3});
            HttpService.toggleItem(item.id, {bought: true}).then(function (_item_) {
                item = _item_;
            });
            $httpBackend.flush();
            expect(item.isBought()).toBe(true);
        });
    });

    describe('SuggestionService', function () {
        var $httpBackend, SuggestionService, mockList, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _SuggestionService_, _ItemModel_) {
            ItemModel = _ItemModel_;
            SuggestionService = _SuggestionService_;
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/suggestions').respond(mockList);
            $httpBackend.flush();
        }));

        it('should update the list on instantiation', function () {
            expect(SuggestionService.list instanceof Array).toBe(true);
            expect(SuggestionService.list.length).toEqual(2);
            expect(SuggestionService.list).toEqual(mockList);
        });

        it('should update the list', function () {
            SuggestionService.list = [];
            expect(SuggestionService.list).toEqual([]);
            SuggestionService.update();
            $httpBackend.flush();
            expect(SuggestionService.list).toEqual(mockList);
        });
    });

    describe('ListController', function () {
        var $httpBackend, $timeout, GroceryService, InputModel, ItemModel, HttpService, ListController, boughtItem, mockEvent,
            unboughtItem, scope;

        beforeEach(function () {
            inject(function ($controller, _$timeout_, _$httpBackend_, _GroceryService_, _HttpService_, _ItemModel_, _InputModel_) {
                GroceryService = _GroceryService_;
                InputModel = _InputModel_;
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
                HttpService = _HttpService_;
                ListController = $controller('ListController', {
                    $scope: scope,
                    $timeout: $timeout,
                    HttpService: HttpService
                });
                $httpBackend.flush();
            });
        });

        it('should exist', function () {
            expect( !! ListController).toBe(true);
        });

        it('should contain a GroceryService', function () {
            expect( !! scope.GroceryService).toBe(true);
        });

        it('should contain a SuggestionService', function () {
            expect( !! scope.SuggestionService).toBe(true);
        });

        it('should contain a DeleteService', function () {
            expect( !! scope.DeleteService).toBe(true);
        });

        it('should initialize an InputModel', function () {
            expect( !! scope.input).toBe(true);
            expect(scope.input instanceof InputModel).toBe(true);
        });

        it('should add items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.SuggestionService.update = function () {
                calledSetSuggestions = true;
            };
            scope.add(unboughtItem.name);
            $httpBackend.flush();
            item = scope.GroceryService.list.pop();
            expect(calledSetSuggestions).toBe(true);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should copy items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.SuggestionService.update = function () {
                calledSetSuggestions = true;
            };
            scope.copy(mockEvent, unboughtItem);
            $httpBackend.flush();
            item = scope.GroceryService.list.pop();
            expect(calledSetSuggestions).toBe(true);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should mark items as bought', function () {
            scope.GroceryService.append(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.buy(mockEvent, unboughtItem);
            $httpBackend.flush();
            expect(unboughtItem.bought_date).not.toBe(null);
        });

        it('should not mark items as bought when the item is scheduled for deletion', function () {
            scope.GroceryService.append(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.DeleteService.add(unboughtItem);
            scope.buy(mockEvent, unboughtItem);
            // Due to `no pending requests to flush` this extra request is added
            scope.add(mockEvent, 'Apples');
            $httpBackend.flush();
            expect(unboughtItem.bought_date).toBe(null);
        });
    });
});
