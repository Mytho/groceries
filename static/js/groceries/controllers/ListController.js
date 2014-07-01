Groceries.controller('ListController', ['$log', '$document', '$scope', '$timeout', 'itemService', 'InputModel', function ($log, $document, $scope, $timeout, itemService, InputModel) {
    $scope.deleteSchedule = {};

    $scope.inputModel = new InputModel(function (value) {
        $scope.add(value);
    });

    $scope.groceries = {
        list: [],
        append: function (item) {
            $scope.groceries.list.push(item);
        },
        remove: function (item) {
            $scope.groceries.list.splice($scope.groceries.list.indexOf(item), 1);
        },
        set: function () {
            itemService.getGroceries().then(function (groceries) {
                $scope.groceries.list = groceries;
            });
        }
    };

    $scope.suggestions = {
        list: [],
        add: function ($event, value) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.inputModel.blur($document[0].getElementById('new-item'));
            $scope.add(value);
        },
        set: function () {
            itemService.getSuggestions().then(function (suggestions) {
                $scope.suggestions.list = suggestions;
            });
        }
    };

    $scope.add = function (name) {
        itemService.addItem(name).then(function (item) {
            $scope.groceries.append(item);
            $scope.suggestions.set();
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
            $scope.groceries.remove(item);
            $scope.suggestions.set();

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

    $scope.groceries.set();
    $scope.suggestions.set();
}]);
