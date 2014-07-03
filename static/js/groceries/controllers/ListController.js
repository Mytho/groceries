Groceries.controller('ListController', ['$document', '$scope', '$timeout', 'DeleteService', 'HttpService', 'GroceryService', 'SuggestionService', 'InputModel',
    function ($document, $scope, $timeout, DeleteService, HttpService, GroceryService, SuggestionService, InputModel) {

    $scope.GroceryService = GroceryService;
    $scope.SuggestionService = SuggestionService;
    $scope.DeleteService = DeleteService;

    $scope.inputModel = new InputModel($scope.add);

    $scope.add = function (name) {
        HttpService.addItem(name).then(function (item) {
            GroceryService.append(item);
            SuggestionService.update();
        });
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if (DeleteService.isScheduled(item)) {
            return;
        }

        HttpService.toggleItem(item.id, ! item.isBought()).then(function (data) {
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
