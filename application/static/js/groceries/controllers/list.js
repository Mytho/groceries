Groceries.controller('listController', ['$scope', 'itemService', function ($scope, itemService) {
    $scope.groceries = [];
    $scope.suggestions = [];

    $scope.buy = function (item) {
        itemService.toggleItem(item.id, ! item.isBought()).then(function (data) {
            item.update(data);
        });
    };

    $scope.delete = function (item, idx) {
        itemService.deleteItem(item.id);
        $scope.groceries.splice(idx, 1);
    };

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
