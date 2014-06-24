Groceries.controller('ListController', ['$scope', '$timeout', 'ItemService', function ($scope, $timeout, ItemService) {
    $scope.groceries = [];
    $scope.inputFocused = false;
    $scope.inputValue = '';
    $scope.suggestions = [];
    $scope.visibleButtons = [];

    $scope.add = function (name) {
        ItemService.addItem(name).then(function (item) {
            $scope.groceries.push(item);
            $scope.inputFocused = false;
            $scope.inputValue = '';
        });
    };

    $scope.buy = function (item, $event) {
        $event.stopPropagation();
        ItemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
        });
    };

    $scope.delete = function (item, $event) {
        $event.stopPropagation();
        ItemService.deleteItem(item.id).then(function () {
            $scope.groceries.splice($scope.groceries.indexOf(item), 1);
        });
    };

    $scope.isButtonVisible = function (item) {
        return $scope.visibleButtons.indexOf(item.id) > -1;
    };

    $scope.keyup = function ($event) {
        if ($event.keyCode !== 13) {
            return;
        }

        $scope.add($scope.inputValue);

        $timeout(function () {
            $event.target.blur();
        }, 250);
    };

    $scope.toggleButton = function (item) {
        if ($scope.visibleButtons.indexOf(item.id) > -1) {
            $scope.visibleButtons.splice($scope.visibleButtons.indexOf(item.id), 1);
        } else {
            $scope.visibleButtons.push(item.id);
        }
    };

    $scope.toggleFocus = function ($event) {
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

    $scope.removeFocus = function ($event) {
        if ($scope.inputFocused) {
            $scope.inputFocused = false;
        }
    };

    ItemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    ItemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
