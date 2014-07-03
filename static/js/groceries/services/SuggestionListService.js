Groceries.service('SuggestionListService', ['HttpService', function (HttpService) {
    this.list = [];

    this.update = function () {
        var self = this;

        HttpService.getSuggestions().then(function (suggestions) {
            self.list = suggestions;
        });
    };

    if ( ! this.list.length) {
        this.update();
    }
}]);
