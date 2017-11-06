//  Source: _lib\realpage\go-back\js\_bundle.inc
angular.module("rpGoBack", []);

//  Source: _lib\realpage\go-back\js\directives\go-back.js
//  Go Back Directive

(function (angular) {
    "use strict";

    function goBack($window) {
        function link(scope, elem, attr) {
            elem.on('click', function () {
                $window.history.back();
            });
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpGoBack")
        .directive('goBack', ['$window', goBack]);
})(angular);

