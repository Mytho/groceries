Groceries.controller('ListController', ['$document', '$scope', '$timeout', 'DeleteScheduleService', 'ItemService', 'GroceryListService', 'SuggestionListService', 'InputModel',
    function ($document, $scope, $timeout, DeleteScheduleService, ItemService, GroceryListService, SuggestionListService, InputModel) {

    $scope.GroceryListService = GroceryListService;
    $scope.SuggestionListService = SuggestionListService;
    $scope.DeleteScheduleService = DeleteScheduleService;

    $scope.inputModel = new InputModel(function (value) {
        $scope.add(value);
    });

    $scope.add = function (name) {
        ItemService.addItem(name).then(function (item) {
            GroceryListService.append(item);
            SuggestionListService.update();
        });
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if (DeleteScheduleService.isScheduled(item)) {
            return;
        }

        ItemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
        });
    };

    $scope.copy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.inputModel.blur($document[0].getElementById('new-item'));
        $scope.add(item.name);
    };
}]);
