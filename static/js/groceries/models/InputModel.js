Groceries.factory('InputModel', ['$timeout', function ($timeout) {
    var InputModel = {};

    InputModel.isFocused = false;

    InputModel.value = '';

    InputModel.blur = function (target) {
        this.isFocused = false;

        $timeout(function () {
            if (target) {
                target.blur();
            }
        }, 250);
    };

    InputModel.focus = function (target) {
        this.isFocused = true;

        $timeout(function () {
            target.focus();
        }, 250);
    };

    InputModel.onBlur = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };

    InputModel.onClick = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        if (this.isFocused) {
            this.blur($event.target);
        } else {
            this.focus($event.target);
        }
    };

    InputModel.onFocus = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.focus($event.target);
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
        }, 250);
    };

    return function (onEnter) {
        angular.extend(this, InputModel);
        angular.extend(this, {onEnter: onEnter});
    };
}]);
