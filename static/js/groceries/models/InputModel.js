Groceries.factory('InputModel', ['$log', '$timeout', function ($log, $timeout) {
    var InputModel = {};

    InputModel.isFocused = false;
    InputModel.value = '';

    InputModel.blur = function (target) {
        this.isFocused = false;

        if (target) {
            target.blur();
        }
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

    return function () {
        angular.extend(this, InputModel);
    };
}]);
