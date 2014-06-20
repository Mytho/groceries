Groceries.service('itemService', ['$http', '$log', 'itemModel', function ($http, $log, itemModel) {
    var convertItems = function (data) {
        var i, items;
        items = [];
        for (i = 0; i < data.length; i++) {
            items.push(new itemModel(data[i]));
        }
        return items;
    };

    this.getGroceries = function () {
        return $http.get('/items').then(function (response) {
            return convertItems(response.data);
        }, function (response) {
            $log.error('Could not load items');
        });
    };

    this.getSuggestions = function () {
        return $http.get('/suggestions').then(function (response) {
            return convertItems(response.data);
        }, function (response) {
            $log.error('Could not load suggestions');
        });
    };
}]);
