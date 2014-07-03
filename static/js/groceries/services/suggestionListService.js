Groceries.service('suggestionListService', ['itemService', function (itemService) {
    this.list = [];

    this.update = function () {
        var self = this;

        itemService.getSuggestions().then(function (suggestions) {
            self.list = suggestions;
        });
    };

    if ( ! this.list.length) {
        this.update();
    }
}]);
