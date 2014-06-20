Groceries.controller('listController', ['$scope', 'itemService', function ($scope, itemService) {
    $scope.groceries = [];
    $scope.suggestions = [];
    $scope.visibleButtons = [];

    $scope.buttonIsVisible = function (item) {
        return $scope.visibleButtons.indexOf(item.id) > -1;
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

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
