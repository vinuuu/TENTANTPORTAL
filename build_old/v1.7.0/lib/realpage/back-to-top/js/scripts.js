//  Source: _lib\realpage\back-to-top\js\_bundle.inc
angular.module("rpBackToTop", []);

//  Source: _lib\realpage\back-to-top\js\directives\back-to-top.js
//  Back To Top Directive

(function (angular) {
    "use strict";

    function directive(windowScroll, windowSize) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                elem.hide();
                dir.doc = angular.element('html, body');
                dir.watch();
                scope.backToTop = dir;
            };

            dir.watch = function () {
                windowSize.subscribe(dir.updateState);
                windowScroll.subscribe(dir.updateState);
            };

            dir.updateState = function (data) {
                var top = data.scrollTop || windowScroll.getScrollTop().scrollTop;
                elem[top > 200 ? 'show' : 'hide']();
            };

            dir.scrollToTop = function() {
                dir.doc.animate({
                    scrollTop: 0
                }, 200);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpBackToTop")
        .directive('backToTop', ['windowScroll', 'windowSize', directive]);
})(angular);

