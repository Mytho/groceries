Groceries.factory('SwipeHandlerModel', ['DeleteScheduleService', function (DeleteScheduleService) {
    return function (scope, element) {
        var handler = {};

        handler.ACTIVE_CLASS_NAME = 'swipe-delete-active';

        handler.FULL_WIDTH_TRESHOLD = 40;

        handler.isEnded = false;

        handler.end = function () {
            this.isEnded = true;
            this.element.removeClass(this.ACTIVE_CLASS_NAME);
            this.element.find('span').css('width', '');
        };

        handler.move = function (coords, $event) {
            var self = this,
                x = coords.x - element[0].offsetLeft;

            if (this.isEnded) {
                return;
            }

            if (x > this.element[0].clientWidth - this.FULL_WIDTH_TRESHOLD) {
                scope.$apply(function () {
                    x = self.element[0].clientWidth;
                    DeleteScheduleService.add($event, self.scope.item);
                    self.end();
                });
            }

            this.element.addClass(this.ACTIVE_CLASS_NAME);
            this.element.find('span').css('width', x + 'px');
        };

        handler.start = function () {
            this.isEnded = false;
        };

        angular.extend(this, handler, {
            element: element,
            scope: scope
        });
    };
}]);
