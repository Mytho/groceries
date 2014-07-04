Groceries.factory('SwipeModel', ['DeleteService', function (DeleteService) {
    return function (scope, element) {
        var handler = {};

        handler.CLASS_NAMES = {
            active: 'swipe-delete-active',
            scheduled: 'swipe-delete-scheduled'
        };

        handler.FULL_WIDTH_TRESHOLD = 65;

        handler.SWIPE_LEFT_TRESHOLD = 10;

        handler.isEnded = false;

        handler.startX = null;

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

            self = this;
            x = coords.x - element[0].offsetLeft;

            if (this.isEnded) {
                return;
            }

            if (x < this.startX - this.SWIPE_LEFT_TRESHOLD) {
                this.end();
                return;
            }

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

        handler.start = function (coords) {
            this.isEnded = false;
            this.startX = coords.x;
        };

        angular.extend(this, handler, {
            scope: scope,
            element: element
        });
    };
}]);
