Groceries.controller('listController', ['$scope', 'itemService', function ($scope, itemService) {
    $scope.groceries = [];
    $scope.suggestions = [];

    $scope.deleteItem = function (id) {
        itemService.deleteItem(id);
    };

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
