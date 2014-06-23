Groceries.factory('ItemModel', function () {
    return function (data) {
        angular.extend(this, {
            id: null,
            name: '',
            bought_by: null,
            bought_date: null,
            isBought: function () {
                return !! (this.bought_by || this.bought_date);
            },
            update: function (data) {
                angular.extend(this, data);
            }
        });

        angular.extend(this, data);
    };
});
