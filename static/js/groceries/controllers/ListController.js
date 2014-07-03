Groceries.controller('ListController',
    ['$document', '$log', '$scope', '$timeout', 'itemService', 'groceryListService', 'suggestionListService', 'InputModel',
    function ($document, $log, $scope, $timeout, itemService, groceryListService, suggestionListService, InputModel) {

    $scope.deleteSchedule = {};

    $scope.groceryListService = groceryListService;
    $scope.suggestionListService = suggestionListService;

    $scope.inputModel = new InputModel(function (value) {
        $scope.add(value);
    });

    $scope.add = function (name) {
        itemService.addItem(name).then(function (item) {
            groceryListService.append(item);
            suggestionListService.update();
        });
    };

    $scope.copy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.inputModel.blur($document[0].getElementById('new-item'));
        $scope.add(item.name);
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if ($scope.isScheduledForDelete(item)) {
            return;
        }

        itemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
        });
    };

    $scope.cancelDelete = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout.cancel($scope.deleteSchedule[item.id]);
        delete $scope.deleteSchedule[item.id];
    };

    $scope.delete = function (item, callback) {
        itemService.deleteItem(item.id).then(function () {
            groceryListService.remove(item);
            suggestionListService.update();

            if (typeof(callback) === 'function') {
                callback();
            }
        });
    };

    $scope.isScheduledForDelete = function (item) {
        return $scope.deleteSchedule.hasOwnProperty(item.id);
    };

    $scope.scheduleDelete = function ($event, item, timeout) {
        $event.preventDefault();
        $event.stopPropagation();

        timeout = timeout || 2500;

        $scope.deleteSchedule[item.id] = $timeout(function () {
            $scope.delete(item, function () {
                delete $scope.deleteSchedule[item.id];
            });
        }, timeout);
    };
}]);
