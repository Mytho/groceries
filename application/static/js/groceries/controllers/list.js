Groceries.controller('listController', ['$scope', '$log', 'itemService', function ($scope, $log, itemService) {
    $scope.groceries = [];
    $scope.suggestions = [];

    itemService.getGroceries().then(function (groceries) {
        $scope.groceries = groceries;
    });

    itemService.getSuggestions().then(function (suggestions) {
        $scope.suggestions = suggestions;
    });

    $log.debug($scope);
}]);
