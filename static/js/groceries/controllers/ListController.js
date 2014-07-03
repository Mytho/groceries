Groceries.controller('ListController', ['$document', '$scope', '$timeout', 'deleteScheduleService', 'itemService', 'groceryListService', 'suggestionListService', 'InputModel',
    function ($document, $scope, $timeout, deleteScheduleService, itemService, groceryListService, suggestionListService, InputModel) {

    $scope.groceryListService = groceryListService;
    $scope.suggestionListService = suggestionListService;
    $scope.deleteScheduleService = deleteScheduleService;

    $scope.inputModel = new InputModel(function (value) {
        $scope.add(value);
    });

    $scope.add = function (name) {
        itemService.addItem(name).then(function (item) {
            groceryListService.append(item);
            suggestionListService.update();
        });
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if (deleteScheduleService.isScheduled(item)) {
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
