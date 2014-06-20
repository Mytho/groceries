Groceries.controller('listController', ['$scope', '$log', function ($scope, $log) {
    $scope.groceries = [];
    $scope.suggestions = [];
    $log.debug($scope);
}]);
