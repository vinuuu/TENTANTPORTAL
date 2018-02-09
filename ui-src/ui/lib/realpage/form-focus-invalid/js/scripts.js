//  Source: _lib\realpage\form-focus-invalid\js\directives\focus-invalid.js
//  Focus Invalid Field Directive

(function (angular, undefined) {
    "use strict";

    function rpFocusInvalidField() {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.focusInvalidField = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.focus = function () {
                elem.find(".ng-invalid:first").trigger("focus");
            };

            dir.destroy = function () {
                dir.destWatch();
                scope.focusInvalidField = undefined;
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpFormFocusInvalid")
        .directive("rpFocusInvalidField", [rpFocusInvalidField]);
})(angular);
