Groceries.service('deleteScheduleService', ['$timeout', 'itemService', 'groceryListService', 'suggestionListService',
    function ($timeout, itemService, groceryListService, suggestionListService) {

    this.schedule = {};

    this.add = function ($event, item, timeout) {
        var self = this;

        $event.preventDefault();
        $event.stopPropagation();

        timeout = timeout || 2500;

        this.schedule[item.id] = $timeout(function () {
            self.delete(item);
        }, timeout);
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
