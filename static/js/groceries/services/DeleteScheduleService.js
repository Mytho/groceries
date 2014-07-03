Groceries.service('DeleteScheduleService', ['$timeout', 'itemService', 'groceryListService', 'suggestionListService',
    function ($timeout, itemService, groceryListService, suggestionListService) {

    this.DELAY = 2500;

    this.schedule = {};

    this.add = function ($event, item) {
        var self = this;

        $event.preventDefault();
        $event.stopPropagation();

        this.schedule[item.id] = $timeout(function () {
            self.delete(item);
        }, this.DELAY);
    };

    this.cancel = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout.cancel(this.schedule[item.id]);
        delete this.schedule[item.id];
    };

    this.delete = function (item) {
        var self = this;

        itemService.deleteItem(item.id).then(function () {
            groceryListService.remove(item);
            suggestionListService.update();

            delete self.schedule[item.id];
        });
    };

    this.isScheduled = function (item) {
        return this.schedule.hasOwnProperty(item.id);
    };
}]);
