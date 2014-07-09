Groceries.factory('SwipeModel', ['DeleteService', function (DeleteService) {
    return function (scope, element) {
        var SwipeModel = {};

        SwipeModel.CLASS_NAMES = {
            active: 'swipe-delete-active',
            scheduled: 'swipe-delete-scheduled'
        };

        SwipeModel.FULL_WIDTH_TRESHOLD = 65;

        SwipeModel.SWIPE_LEFT_TRESHOLD = 10;

        SwipeModel.isEnded = false;

        SwipeModel.startX = 0;

        SwipeModel.cancel = function () {
            this.element.removeClass(this.CLASS_NAMES.active);
            this.element.removeClass(this.CLASS_NAMES.scheduled);
            this.element.find('span').css('width', '');
            this.element.find('span').find('label').css('margin-left', '');
        };

        SwipeModel.end = function (coords) {
            this.isEnded = true;

            if (DeleteService.isScheduled(this.scope.item)) {
                this.element.removeClass(this.CLASS_NAMES.active);
                this.element.addClass(this.CLASS_NAMES.scheduled);
                this.element.find('span').find('label').css('margin-left', '');
                return;
            }

            this.cancel();
        };

        SwipeModel.getClientWidth = function () {
            return this.element[0].clientWidth;
        };

        SwipeModel.getX = function (coords) {
            return coords.x - this.element[0].offsetLeft;
        };

        SwipeModel.move = function (coords) {
            var clientWidth, self, x;

            self = this;
            x = this.getX(coords);
            clientWidth = this.getClientWidth();

            if (this.isEnded) {
                return;
            }

            if (x < this.startX - this.SWIPE_LEFT_TRESHOLD) {
                this.end();
                return;
            }

            if (x >= clientWidth - this.FULL_WIDTH_TRESHOLD) {
                x = clientWidth;

                scope.$apply(function () {
                    DeleteService.add(self.scope.item);
                    self.end();
                });
            }

            this.element.addClass(this.CLASS_NAMES.active);
            this.element.find('span').css('width', x + 'px');
            this.element.find('span').find('label').css('margin-left', x + 'px');
        };

        SwipeModel.start = function (coords) {
            this.isEnded = false;
            this.startX = this.getX(coords);
        };

        angular.extend(this, SwipeModel, {
            scope: scope,
            element: element
        });
    };
}]);
