Groceries.directive('swipeDelete', ['$swipe', function ($swipe) {
    return {
        restrict: 'A',
        scope: {
            label: '=swipeDelete'
        },
        link: function (scope, element, attrs) {
            var swipeHandlers = {};

            element.addClass('swipe-delete');
            element.append('<span class="swipe-delete-overlay"><span class="swipe-delete-overlay-label">'+ scope.label +'</span></span>');

            swipeHandlers.move = function (coords) {
                var x = coords.x - element[0].offsetLeft;

                if (x > element[0].clientWidth) {
                    x = element[0].clientWidth;
                }

                element.addClass('swipe-delete-active');
                element.find('span').css('width', x + 'px');
            };

            swipeHandlers.end = function (coords) {
                element.removeClass('swipe-delete-active');
                element.find('span').css('width', '');
            };

            $swipe.bind(element, swipeHandlers);
        }
    };
}]);
