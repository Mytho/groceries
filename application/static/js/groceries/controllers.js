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
            $scope.hideAllButtons();
            $scope.setSuggestions();
        });
    };

    $scope.buy = function (item, $event) {
        $event.stopPropagation();

        ItemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
            $scope.hideAllButtons();
        });
    };

    $scope.delete = function (item, $event) {
        $event.stopPropagation();

        ItemService.deleteItem(item.id).then(function () {
            $scope.groceries.splice($scope.groceries.indexOf(item), 1);
            $scope.hideAllButtons();
            $scope.setSuggestions();
        });
    };

    $scope.hideAllButtons = function () {
        $scope.visibleButtons = [];
    };

    $scope.isButtonVisible = function (item) {
        return $scope.visibleButtons.indexOf(item.id) > -1;
    };

    $scope.keyup = function ($event) {
        if ($event.keyCode !== 13 || ! $scope.inputValue) {
            return;
        }

        $scope.add($scope.inputValue);

        $timeout(function () {
            $event.target.blur();
        }, 250);
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

    $scope.toggleButton = function (item, $event) {
        $event.stopPropagation();

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

    $scope.removeFocus = function () {
        if ($scope.inputFocused) {
            $timeout(function () {
                $scope.inputFocused = false;
            }, 250);
        }
    };

    $scope.setGroceries();
    $scope.setSuggestions();
}]);
