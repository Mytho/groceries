Groceries.directive('swipeDelete', ['$log', '$swipe', function ($log, $swipe) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            var getOffset, handlers;

            handlers = {};

            handlers.move = function (coords) {
                var x = coords.x;

                if (coords.x > element[0].offsetWidth)  {
                    x = element[0].offsetWidth;
                }

                element.addClass('swipe-delete-active');
                element.find('span').css('width', x + 'px');
            };

            handlers.end = function (coords) {
                element.removeClass('swipe-delete-active');
                element.find('span').css('width', '');
            };

            $swipe.bind(element, handlers);
        }
    };
}]);
