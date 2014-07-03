Groceries.service('DeleteService', ['$timeout', 'HttpService', 'GroceryService', 'SuggestionService',
    function ($timeout, HttpService, GroceryService, SuggestionService) {

    this.DELAY = 2500;

    this.schedule = {};

    this.add = function (item) {
        var self = this;

        this.schedule[item.id] = $timeout(function () {
            self.delete(item);
        }, this.DELAY);
    };

    this.cancel = function (item) {
        $timeout.cancel(this.schedule[item.id]);
        delete this.schedule[item.id];
    };

    this.delete = function (item) {
        var self = this;

        HttpService.deleteItem(item.id).then(function () {
            GroceryService.remove(item);
            SuggestionService.update();

            delete self.schedule[item.id];
        });
    };

    this.isScheduled = function (item) {
        return this.schedule.hasOwnProperty(item.id);
    };
}]);
