Groceries.factory('itemModel', function () {
    var itemModel = function (data) {
        angular.extend(this, {
            id: null,
            name: '',
            bought_by: null,
            bought_date: null,
            bought: function () {
                return (this.bought_by || this.bought_date);
            }
        });
    };

    return itemModel;
});
