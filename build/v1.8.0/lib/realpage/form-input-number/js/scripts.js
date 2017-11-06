//  Source: _lib\realpage\form-input-number\js\_bundle.inc
angular.module("rpInputNumber", []);

//  Source: _lib\realpage\form-input-number\js\directives\input-type-number.js
//  Input Type Number Directive

(function (angular) {
    "use strict";

    function inputTypeNumber(keycode) {
        function link(scope, elem, attr) {
            function onKeyDown(event) {
                var result = keycode.test(event);
                return (result.numeric && !result.shift) || result.nav;
            }

            elem.on('keydown.inputTypeNumber', onKeyDown);
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module('rpFormInputNumber')
        .directive('rpInputTypeNumber', ['keycode', inputTypeNumber]);
})(angular);

