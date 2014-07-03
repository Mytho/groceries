Groceries.directive('swipeDelete', ['$swipe', 'SwipeHandlerModel', function ($swipe, SwipeHandlerModel) {
    return {
        restrict: 'A',
        scope: {
            item: '=swipeDelete'
        },
        link: function (scope, element, attrs) {
            var swipeHandlerModel = new SwipeHandlerModel(scope, element);

            element.addClass('swipe-delete');
            element.append('<span class="swipe-delete-overlay"><span class="swipe-delete-overlay-label">'+ scope.item.name +'</span></span>');

            $swipe.bind(element, swipeHandlerModel);
        }
    };
}]);
