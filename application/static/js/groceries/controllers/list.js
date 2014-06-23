Groceries.controller('listController', ['$scope', '$timeout', 'itemService', function ($scope, $timeout, itemService) {
    $scope.groceries = [];
    $scope.inputFocused = false;
    $scope.inputValue = '';
    $scope.suggestions = [];
    $scope.visibleButtons = [];

    $scope.buttonIsVisible = function (item) {
        return $scope.visibleButtons.indexOf(item.id) > -1;
    };

    $scope.add = function (name) {
        itemService.addItem(name).then(function (item) {
            $scope.groceries.push(item);
            $scope.inputFocused = false;
            $scope.inputValue = '';
        });
    };

    $scope.buy = function (item, $event) {
        $event.stopPropagation();
        itemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
        });
    };

    $scope.delete = function (item, $event) {
        $event.stopPropagation();
        itemService.deleteItem(item.id).then(function () {
            $scope.groceries.splice($scope.groceries.indexOf(item), 1);
        });
    };

    $scope.focusIn = function () {
        $scope.inputFocused = true;
    };

    $scope.focusOut = function () {
        $timeout(function () {
            $scope.inputFocused = false;
        }, 250);
    };

    $scope.keyup = function ($event) {
        if ($event.keyCode != 13) {
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

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
