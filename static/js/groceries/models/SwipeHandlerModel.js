Groceries.factory('SwipeHandlerModel', function () {
    return function (element) {
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
            }

            this.element.addClass(this.ACTIVE_CLASS_NAME);
            this.element.find('span').css('width', x + 'px');
        };

        angular.extend(this, handler, {element: element});
    };
});
