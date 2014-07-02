Groceries.directive('swipeDelete', ['$swipe', 'SwipeHandlerModel', function ($swipe, SwipeHandlerModel) {
    return {
        restrict: 'A',
        scope: {
            label: '=swipeDelete'
        },
        link: function (scope, element, attrs) {
            var swipeHandlerModel = new SwipeHandlerModel(element);

            element.addClass('swipe-delete');
            element.append('<span class="swipe-delete-overlay"><span class="swipe-delete-overlay-label">'+ scope.label +'</span></span>');

            $swipe.bind(element, swipeHandlerModel);
        }
    };
}]);
