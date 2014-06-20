Groceries.factory('itemModel', function () {
    return function (data) {
        angular.extend(this, {
            id: null,
            name: '',
            bought_by: null,
            bought_date: null,
            is_bought: function () {
                return (this.bought_by && this.bought_date);
            }
        });

        angular.extend(this, data);
    };
});
