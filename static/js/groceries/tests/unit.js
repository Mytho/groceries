'use strict';

describe('Groceries', function () {
    beforeEach(module('Groceries'));

    it('should interpolate with brackets', inject(function ($interpolate) {
        var expression = $interpolate('Hello [[name]]!');
        expect(expression({name: 'World'})).toBe('Hello World!');
    }));

    describe('swipeDelete', function () {
        var $compile, $rootScope, html, scope, testItem, ItemModel;

        beforeEach(inject(function (_$rootScope_, _$compile_, _ItemModel_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            ItemModel = _ItemModel_;
            scope = $rootScope.$new();
            scope.item = new ItemModel({id: 1, name: 'Apples'});
            html = $compile('<span swipe-delete="item"></span>')(scope);
        }));

        it('should initialize the elements', function () {
            expect(html.attr('class')).toMatch(/swipe-delete/);
            expect(html.find('span').attr('class')).toMatch(/swipe-delete-overlay/);
            expect(html.find('span').find('span').attr('class')).toMatch(/swipe-delete-overlay-label/);
            expect(html.find('span').find('span').text()).toBe(scope.item.name);
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

    describe('DeleteScheduleService', function () {
        var $httpBackend, $timeout, DeleteScheduleService, GroceryListService, mockEvent, mockItem, mockList, SuggestionListService, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _$timeout_, _DeleteScheduleService_, _GroceryListService_, _SuggestionListService_, _ItemModel_) {
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            ItemModel = _ItemModel_;
            mockEvent = {
                preventDefault: function () {},
                stopPropagation: function () {}
            };
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            DeleteScheduleService = _DeleteScheduleService_;
            GroceryListService = _GroceryListService_;
            SuggestionListService = _SuggestionListService_;
            mockItem = new ItemModel({id: 1, name: 'Apples'});
            $httpBackend.whenGET('/items').respond(mockList);
            $httpBackend.whenGET('/suggestions').respond(mockList);
            $httpBackend.flush();
        }));

        it('should keep a schedule on what items are to be deleted', function () {
            expect(DeleteScheduleService.schedule).toEqual({});
        });

        it('should add items to the schedule', function () {
            var mockItem = new ItemModel({id: 1, name: 'Apples'});
            expect(DeleteScheduleService.schedule).toEqual({});
            DeleteScheduleService.add(mockEvent, mockItem);
            expect(DeleteScheduleService.schedule.hasOwnProperty(mockItem.id)).toBe(true);
        });

        it('should cancel scheduled items', function () {
            DeleteScheduleService.add(mockEvent, mockItem);
            expect(DeleteScheduleService.schedule.hasOwnProperty(mockItem.id)).toBe(true);
            DeleteScheduleService.cancel(mockEvent, mockItem);
            expect(DeleteScheduleService.schedule.hasOwnProperty(mockItem.id)).toBe(false);
        });

        it('should delete items', function () {
            var removedId, isUpdated;
            GroceryListService.remove = function (item) {
                removedId = item.id;
            };
            SuggestionListService.update = function () {
                isUpdated = true;
            };
            $httpBackend.whenDELETE('/items/'+mockItem.id).respond(200, '');
            DeleteScheduleService.add(mockEvent, mockItem);
            $timeout.flush();
            $httpBackend.flush();
            expect(removedId).toBe(mockItem.id);
            expect(isUpdated).toBe(true);
            expect(DeleteScheduleService.schedule).toEqual({});
        });

        it('should check if items are scheduled', function () {
            expect(DeleteScheduleService.isScheduled(mockItem)).toBe(false);
            DeleteScheduleService.add(mockEvent, mockItem);
            expect(DeleteScheduleService.isScheduled(mockItem)).toBe(true);
        });
    });

    describe('GroceryListService', function () {
        var $httpBackend, GroceryListService, mockList, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _GroceryListService_, _ItemModel_) {
            ItemModel = _ItemModel_;
            GroceryListService = _GroceryListService_;
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/items').respond(mockList);
            $httpBackend.flush();
        }));

        it('should update the list on instantiation', function () {
            expect(GroceryListService.list instanceof Array).toBe(true);
            expect(GroceryListService.list.length).toEqual(2);
            expect(GroceryListService.list).toEqual(mockList);
        });

        it('should append items to the list', function () {
            var newItem = new ItemModel({id: 3, name: 'Oranges'});
            expect(GroceryListService.list.length).toEqual(2);
            expect(GroceryListService.list).toEqual(mockList);
            GroceryListService.append(newItem);
            mockList.push(newItem);
            expect(GroceryListService.list.length).toEqual(3);
            expect(GroceryListService.list).toEqual(mockList);
        });

        it('should remove items from the list', function () {
            var removedItem;
            expect(GroceryListService.list.length).toEqual(2);
            expect(GroceryListService.list).toEqual(mockList);
            removedItem = mockList.pop();
            GroceryListService.remove(removedItem);
            expect(GroceryListService.list.length).toEqual(1);
            expect(GroceryListService.list).toEqual(mockList);
        });

        it('should update the list', function () {
            GroceryListService.list = [];
            expect(GroceryListService.list).toEqual([]);
            GroceryListService.update();
            $httpBackend.flush();
            expect(GroceryListService.list).toEqual(mockList);
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

    describe('SuggestionListService', function () {
        var $httpBackend, SuggestionListService, mockList, ItemModel;

        beforeEach(inject(function (_$httpBackend_, _SuggestionListService_, _ItemModel_) {
            ItemModel = _ItemModel_;
            SuggestionListService = _SuggestionListService_;
            mockList = [new ItemModel({id: 1, name: 'Apples'}), new ItemModel({id: 2, name: 'Bananas'})];
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/suggestions').respond(mockList);
            $httpBackend.flush();
        }));

        it('should update the list on instantiation', function () {
            expect(SuggestionListService.list instanceof Array).toBe(true);
            expect(SuggestionListService.list.length).toEqual(2);
            expect(SuggestionListService.list).toEqual(mockList);
        });

        it('should update the list', function () {
            SuggestionListService.list = [];
            expect(SuggestionListService.list).toEqual([]);
            SuggestionListService.update();
            $httpBackend.flush();
            expect(SuggestionListService.list).toEqual(mockList);
        });
    });

    describe('ListController', function () {
        var $httpBackend, $timeout, GroceryListService, InputModel, ItemModel, ItemService, ListController, boughtItem, mockEvent,
            unboughtItem, scope;

        beforeEach(function () {
            inject(function ($controller, _$timeout_, _$httpBackend_, _GroceryListService_, _ItemService_, _ItemModel_, _InputModel_) {
                GroceryListService = _GroceryListService_;
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

        it('should contain a GroceryListService', function () {
            expect( !! scope.GroceryListService).toBe(true);
        });

        it('should contain a SuggestionListService', function () {
            expect( !! scope.SuggestionListService).toBe(true);
        });

        it('should contain a DeleteScheduleService', function () {
            expect( !! scope.DeleteScheduleService).toBe(true);
        });

        it('should initialize an inputModel', function () {
            expect( !! scope.inputModel).toBe(true);
            expect(scope.inputModel instanceof InputModel).toBe(true);
        });

        it('should add items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.SuggestionListService.update = function () {
                calledSetSuggestions = true;
            };
            scope.add(unboughtItem.name);
            $httpBackend.flush();
            item = scope.GroceryListService.list.pop();
            expect(calledSetSuggestions).toBe(true);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should copy items', function () {
            var item, calledSetSuggestions;
            calledSetSuggestions = false;
            scope.SuggestionListService.update = function () {
                calledSetSuggestions = true;
            };
            scope.copy(mockEvent, unboughtItem);
            $httpBackend.flush();
            item = scope.GroceryListService.list.pop();
            expect(calledSetSuggestions).toBe(true);
            expect(item.name).toEqual(unboughtItem.name);
        });

        it('should mark items as bought', function () {
            scope.GroceryListService.append(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.buy(mockEvent, unboughtItem);
            $httpBackend.flush();
            expect(unboughtItem.bought_date).not.toBe(null);
        });

        it('should not mark items as bought when the item is scheduled for deletion', function () {
            scope.GroceryListService.append(unboughtItem);
            expect(unboughtItem.bought_date).toBe(null);
            scope.DeleteScheduleService.add(mockEvent, unboughtItem, 3500);
            scope.buy(mockEvent, unboughtItem);
            // Due to `no pending requests to flush` this extra request is added
            scope.add(mockEvent, 'Apples');
            $httpBackend.flush();
            expect(unboughtItem.bought_date).toBe(null);
        });
    });
});
