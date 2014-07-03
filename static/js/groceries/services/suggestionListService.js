Groceries.service('suggestionListService', ['ItemService', function (ItemService) {
    this.list = [];

    this.update = function () {
        var self = this;

        ItemService.getSuggestions().then(function (suggestions) {
            self.list = suggestions;
        });
    };

    if ( ! this.list.length) {
        this.update();
    }
}]);
