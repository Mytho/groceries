Groceries.directive('swipeDelete', ['$compile', '$swipe', 'DeleteService', 'SwipeModel',
    function ($compile, $swipe, DeleteService, SwipeModel) {

    return {
        restrict: 'A',
        scope: {item: '=swipeDelete'},
        link: function (scope, element, attrs) {
            var html, swipeModel;

            swipeModel = new SwipeModel(scope, element);

            scope.cancel = function ($event, item) {
                $event.preventDefault();
                $event.stopPropagation();

                DeleteService.cancel(item);
                swipeModel.cancel();
            };

            html = $compile(
                '<span class="swipe-delete-overlay">'+
                    '<input type="checkbox">'+
                    '<label>[[item.name]]</label>'+
                    '<button ng-click="cancel($event, item)">UNDO</button>'+
                '</span>'
            )(scope);

            element.addClass('swipe-delete').prepend(html);

            $swipe.bind(element, swipeModel);
        }
    };
}]);
