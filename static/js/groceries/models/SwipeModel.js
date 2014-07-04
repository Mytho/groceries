Groceries.factory('SwipeModel', ['DeleteService', function (DeleteService) {
    return function (scope, element) {
        var handler = {};

        handler.CLASS_NAMES = {
            active: 'swipe-delete-active',
            scheduled: 'swipe-delete-scheduled'
        };

        handler.FULL_WIDTH_TRESHOLD = 65;

        handler.isEnded = false;

        handler.cancel = function () {
            this.element.removeClass(this.CLASS_NAMES.active);
            this.element.removeClass(this.CLASS_NAMES.scheduled);
            this.element.find('span').css('width', '');
            this.element.find('span').find('label').css('margin-left', '');
        };

        handler.end = function (coords) {
            this.isEnded = true;

            if (DeleteService.isScheduled(this.scope.item)) {
                this.element.removeClass(this.CLASS_NAMES.active);
                this.element.addClass(this.CLASS_NAMES.scheduled);
                this.element.find('span').find('label').css('margin-left', '');
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
                    DeleteService.add(self.scope.item);
                    self.end();
                });
            }

            this.element.addClass(this.CLASS_NAMES.active);
            this.element.find('span').css('width', x + 'px');
            this.element.find('span').find('label').css('margin-left', x + 'px');
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
