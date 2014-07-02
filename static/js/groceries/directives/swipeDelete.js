Groceries.directive('swipeDelete', ['$swipe', function ($swipe) {
    function SwipeHandler (element) {
        var handler = {};

        handler.ACTIVE_CLASS_NAME = 'swipe-delete-active';
        handler.FULL_WIDTH_TRESHOLD = 35;

        handler.end = function () {
            this.element.removeClass(this.ACTIVE_CLASS_NAME);
            this.element.find('span').css('width', '');
        };

        handler.move = function (coords) {
            var x = coords.x - element[0].offsetLeft;

            if (x > this.element[0].clientWidth - this.FULL_WIDTH_TRESHOLD) {
                x = this.element[0].clientWidth;
                // TODO: End the swipe event if possible?
                this.end();
                return;
            }

            this.element.addClass(this.ACTIVE_CLASS_NAME);
            this.element.find('span').css('width', x + 'px');
        };

        angular.extend(this, handler, {element: element});
    }

    return {
        restrict: 'A',
        scope: {
            label: '=swipeDelete'
        },
        link: function (scope, element, attrs) {
            var swipeHandler = new SwipeHandler(element);

            element.addClass('swipe-delete');
            element.append('<span class="swipe-delete-overlay"><span class="swipe-delete-overlay-label">'+ scope.label +'</span></span>');

            $swipe.bind(element, swipeHandler);
        }
    };
}]);
