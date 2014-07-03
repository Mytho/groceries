Groceries.controller('ListController', ['$document', '$scope', '$timeout', 'DeleteScheduleService', 'itemService', 'GroceryListService', 'suggestionListService', 'InputModel',
    function ($document, $scope, $timeout, DeleteScheduleService, itemService, GroceryListService, suggestionListService, InputModel) {

    $scope.GroceryListService = GroceryListService;
    $scope.suggestionListService = suggestionListService;
    $scope.DeleteScheduleService = DeleteScheduleService;

    $scope.inputModel = new InputModel(function (value) {
        $scope.add(value);
    });

    $scope.add = function (name) {
        itemService.addItem(name).then(function (item) {
            GroceryListService.append(item);
            suggestionListService.update();
        });
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if (DeleteScheduleService.isScheduled(item)) {
            return;
        }

        itemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
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
