Groceries.service('GroceryListService', ['ItemService', function (ItemService) {
    this.list = [];

    this.append = function (item) {
        this.list.push(item);
    };

    this.remove = function (item) {
        this.list.splice(this.list.indexOf(item), 1);
    };

    this.update = function () {
        var self = this;

        ItemService.getGroceries().then(function (groceries) {
            self.list = groceries;
        });
    };

    if ( ! this.list.length) {
        this.update();
    }
}]);
