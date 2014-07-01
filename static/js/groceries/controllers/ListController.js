Groceries.controller('ListController', ['$scope', '$timeout', 'itemService', 'InputModel', function ($scope, $timeout, itemService, InputModel) {
    $scope.deleteSchedule = {};
    $scope.groceries = [];
    $scope.suggestions = [];

    $scope.inputModel = new InputModel();

    $scope.add = function ($event, name) {
        $event.preventDefault();
        $event.stopPropagation();

        itemService.addItem(name).then(function (item) {
            $scope.groceries.push(item);
            //$scope.inputModel.blur();
            //$scope.inputModel.value = '';
            $scope.setSuggestions();
        });
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
            $scope.groceries.splice($scope.groceries.indexOf(item), 1);
            $scope.setSuggestions();

            if (typeof(callback) === 'function') {
                callback();
            }
        });
    };

    $scope.isScheduledForDelete = function (item) {
        return $scope.deleteSchedule.hasOwnProperty(item.id);
    };

    // TODO: Move to inputModel
    $scope.keyup = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        if ($event.keyCode !== 13 || ! $scope.inputModel.value) {
            return;
        }

        $scope.add($event, $scope.inputModel.value);
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

    $scope.setGroceries = function () {
        itemService.getGroceries().then(function (groceries) {
            $scope.groceries = groceries;
        });
    };

    $scope.setSuggestions = function () {
        itemService.getSuggestions().then(function (suggestions) {
            $scope.suggestions = suggestions;
        });
    };

    $scope.setGroceries();
    $scope.setSuggestions();
}]);
