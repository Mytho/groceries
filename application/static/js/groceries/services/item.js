Groceries.service('itemService', ['$http', '$log', 'ItemModel', function ($http, $log, ItemModel) {
    var convertItems = function (data) {
        var i, items;
        items = [];
        for (i = 0; i < data.length; i++) {
            items.push(new ItemModel(data[i]));
        }
        return items;
    };

    this.addItem = function (name) {
        return $http.post('/items', {name: name}).then(function (response) {
            return new ItemModel(response.data);
        }, function (response) {
            $log.error('Could not add item');
        });
    };

    this.deleteItem = function (id) {
        return $http.delete('/items/'+id).then(function (response) {
            return response.status === 200;
        }, function (response) {
            $log.error('Could not delete item');
        });
    };

    this.toggleItem = function (id, isBought) {
        return $http.put('/items/'+id, {bought: isBought}).then(function (response) {
            return new ItemModel(response.data);
        }, function (response) {
            $log.error('Could not toggle items');
        });
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
