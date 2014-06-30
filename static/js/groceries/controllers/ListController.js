Groceries.controller('ListController', ['$scope', '$timeout', 'ItemService', function ($scope, $timeout, ItemService) {
    $scope.deleteSchedule = {};
    $scope.groceries = [];
    $scope.inputFocused = false;
    $scope.inputValue = '';
    $scope.suggestions = [];

    $scope.add = function ($event, name) {
        $event.preventDefault();
        $event.stopPropagation();

        ItemService.addItem(name).then(function (item) {
            $scope.groceries.push(item);
            $scope.inputFocused = false;
            $scope.inputValue = '';
            $scope.setSuggestions();
        });
    };

    $scope.buy = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        if ($scope.isScheduledForDelete(item)) {
            return;
        }

        ItemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
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
        ItemService.deleteItem(item.id).then(function () {
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

    $scope.keyup = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        if ($event.keyCode !== 13 || ! $scope.inputValue) {
            return;
        }

        $scope.add($event, $scope.inputValue);

        $timeout(function () {
            $event.target.blur();
        }, 250);
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

    $scope.removeFocus = function () {
        if ($scope.inputFocused) {
            $timeout(function () {
                $scope.inputFocused = false;
            }, 250);
        }
    };

    $scope.setGroceries = function () {
        ItemService.getGroceries().then(function (groceries) {
            $scope.groceries = groceries;
        });
    };

    $scope.setSuggestions = function () {
        ItemService.getSuggestions().then(function (suggestions) {
            $scope.suggestions = suggestions;
        });
    };

    $scope.toggleFocus = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        if ( ! $scope.inputFocused) {
            $scope.inputFocused = true;
            $event.target.focus();
            return;
        }

        $timeout(function () {
            $scope.inputFocused = false;
            $event.target.blur();
        }, 250);
    };

    $scope.setGroceries();
    $scope.setSuggestions();
}]);
