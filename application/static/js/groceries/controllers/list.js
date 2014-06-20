Groceries.controller('listController', ['$scope', 'itemService', function ($scope, itemService) {
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
        itemService.deleteItem(item.id).then(function () {;
            $scope.groceries.splice($scope.groceries.indexOf(item), 1);
        });
    };

    $scope.toggleButton = function (item) {
        if ($scope.visibleButtons.indexOf(item.id) > -1) {
            $scope.visibleButtons.splice($scope.visibleButtons.indexOf(item.id), 1);
        } else {
            $scope.visibleButtons.push(item.id);
        }
    };

    $scope.toggleFocus= function () {
        $scope.inputFocused = ! $scope.inputFocused;
    };

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
