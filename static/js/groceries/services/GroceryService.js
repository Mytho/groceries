Groceries.service('GroceryService', ['HttpService', function (HttpService) {
    this.list = [];

    this.append = function (item) {
        this.list.push(item);
    };

    this.remove = function (item) {
        this.list.splice(this.list.indexOf(item), 1);
    };

    this.update = function () {
        var self = this;

        HttpService.getGroceries().then(function (groceries) {
            self.list = groceries;
        });
    };

    if ( ! this.list.length) {
        this.update();
    }
}]);
