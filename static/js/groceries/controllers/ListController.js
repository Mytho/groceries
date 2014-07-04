Groceries.controller('ListController', ['$document', '$scope', '$timeout', 'DeleteService', 'GroceryService', 'HttpService', 'InputModel', 'SuggestionService',
    function ($document, $scope, $timeout, DeleteService, GroceryService, HttpService, InputModel, SuggestionService) {

    $scope.GroceryService = GroceryService;
    $scope.SuggestionService = SuggestionService;
    $scope.DeleteService = DeleteService;

    $scope.input = new InputModel(function (value) {
        $scope.add(value);
    });

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

        $scope.input.blur($document[0].getElementById('new-item'));
        $scope.add(item.name);
    };
}]);
