Groceries.factory('SwipeHandlerModel', ['DeleteScheduleService', function (DeleteScheduleService) {
    return function (scope, element) {
        var handler = {};

        handler.CLASS_NAMES = {
            active: 'swipe-delete-active',
            sheduled: 'swipe-delete-scheduled'
        };

        handler.FULL_WIDTH_TRESHOLD = 40;

        handler.isEnded = false;

        handler.cancel = function () {
            this.element.removeClass(this.CLASS_NAMES.scheduled);
            this.element.find('span').css('width', '');
        };

        handler.end = function (coords) {
            this.isEnded = true;

            if (DeleteScheduleService.isScheduled(this.scope.item)) {
                this.element.removeClass(this.CLASS_NAMES.active);
                this.element.addClass(this.CLASS_NAMES.scheduled);
                return;
            }

            this.cancel();
        };

        handler.move = function (coords, $event) {
            var self, x;

            if (this.isEnded) {
                return;
            }

            self = this;
            x = coords.x - element[0].offsetLeft;

            if (x >= this.element[0].clientWidth - this.FULL_WIDTH_TRESHOLD) {
                x = this.element[0].clientWidth;

                scope.$apply(function () {
                    DeleteScheduleService.add(self.scope.item);
                    self.end();
                });
            }

            this.element.addClass(this.CLASS_NAMES.active);
            this.element.find('span').css('width', x + 'px');
        };

        handler.start = function () {
            this.isEnded = false;
        };

        angular.extend(this, handler, {
            scope: scope,
            element: element
        });
    };
}]);
