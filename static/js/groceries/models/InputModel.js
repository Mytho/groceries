Groceries.factory('InputModel', ['$timeout', function ($timeout) {
    var InputModel = {};

    InputModel.DELAY = 250;

    InputModel.isFocused = false;

    InputModel.value = '';

    InputModel.blur = function (target) {
        if (this.isFocused) {
            $timeout(function () {
                target.blur();
            }, this.DELAY);
        }

        this.isFocused = false;
    };

    InputModel.focus = function (target) {
        if ( ! this.isFocused) {
            $timeout(function () {
                 target.focus();
            }, this.DELAY);
        }

        this.isFocused = true;
    };

    InputModel.onBlur = function ($event) {
        var self = this;

        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            self.blur($event.target);
        }, this.DELAY);
    };

    InputModel.onFocus = function ($event) {
        var self = this;

        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            self.focus($event.target);
        }, self.DELAY);
    };

    InputModel.onKeyup = function ($event) {
        var self = this;

        $event.preventDefault();
        $event.stopPropagation();

        if ($event.keyCode !== 13 || ! this.value) {
            return;
        }

        this.onEnter(this.value);
        this.value = '';

        $timeout(function () {
            self.blur($event.target);
        }, this.DELAY);
    };

    return function (onEnter) {
        angular.extend(this, InputModel, {onEnter: onEnter});
    };
}]);
