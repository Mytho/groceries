Groceries.controller('listController', ['$scope', 'itemService', function ($scope, itemService) {
    $scope.groceries = [];
    $scope.suggestions = [];

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });
}]);
