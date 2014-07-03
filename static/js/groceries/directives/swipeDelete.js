Groceries.directive('swipeDelete', ['$log', '$compile', '$swipe', 'DeleteScheduleService', 'SwipeHandlerModel',
    function ($log, $compile, $swipe, DeleteScheduleService, SwipeHandlerModel) {

    return {
        restrict: 'A',
        scope: {item: '=swipeDelete'},
        link: function (scope, element, attrs) {
            var html, swipeHandlerModel;

            swipeHandlerModel = new SwipeHandlerModel(scope, element);

            scope.cancel = function ($event, item) {
                DeleteScheduleService.cancel($event, item);
                swipeHandlerModel.cancel();
            };

            html = $compile(
                '<span class="swipe-delete-overlay">'+
                    '<input type="checkbox">'+
                    '<label>[[item.name]]</label>'+
                    '<button ng-click="cancel($event, item)">CANCEL</button>'+
                '</span>'
            )(scope);

            element.addClass('swipe-delete').append(html);

            $swipe.bind(element, swipeHandlerModel);
        }
    };
}]);
