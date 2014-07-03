Groceries.directive('swipeDelete', ['$compile', '$swipe', 'DeleteScheduleService', 'SwipeModel',
    function ($compile, $swipe, DeleteScheduleService, SwipeModel) {

    return {
        restrict: 'A',
        scope: {item: '=swipeDelete'},
        link: function (scope, element, attrs) {
            var html, swipeModel;

            swipeModel = new SwipeModel(scope, element);

            scope.cancel = function ($event, item) {
                $event.preventDefault();
                $event.stopPropagation();

                DeleteScheduleService.cancel(item);
                swipeModel.cancel();
            };

            html = $compile(
                '<span class="swipe-delete-overlay">'+
                    '<input type="checkbox">'+
                    '<label>[[item.name]]</label>'+
                    '<button ng-click="cancel($event, item)">CANCEL</button>'+
                '</span>'
            )(scope);

            element.addClass('swipe-delete').append(html);

            $swipe.bind(element, swipeModel);
        }
    };
}]);
