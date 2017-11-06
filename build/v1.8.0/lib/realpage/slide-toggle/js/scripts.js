//  Source: _lib\realpage\slide-toggle\js\_bundle.inc
angular.module("rpSlideToggle", []);

//  Source: _lib\realpage\slide-toggle\js\directives\slide-toggle.js
//  Slide Toggle Directive

(function (angular) {
    "use strict";

    function rpSlideToggle(timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                openHeight,
                firstPass = true;

            dir.model = function () {
                return scope.$eval(attr.rpSlideToggle);
            };

            dir.state = function () {
                return dir.model().state.open;
            };

            dir.init = function () {
                dir.updateHeight();
                var name = dir.model() && dir.model().name;
                scope[name || 'rpSlideToggle'] = dir;
                scope.$watch(dir.state, dir.toggle);
            };

            dir.toggle = function (bool) {
                if (firstPass) {
                    firstPass = false;
                    return;
                }
                dir[bool ? 'open' : 'close']();
            };

            dir.open = function () {
                elem.animate({
                    height: openHeight
                }, 250, dir.setOpen);
            };

            dir.close = function () {
                dir.recordHeight().setClosed();

                elem.height(openHeight).animate({
                    height: 0
                }, 250);
            };

            dir.setOpen = function () {
                elem.height('');
                elem.addClass('open');
            };

            dir.setClosed = function () {
                elem.removeClass('open');
            };

            dir.recordHeight = function () {
                openHeight = elem.height();
                elem.removeClass('not-ready');
                return dir;
            };

            dir.updateHeight = function () {
                elem.addClass('not-ready');
                timeout(dir.recordHeight);
            };

            if (dir.model()) {
                dir.init();
            }
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpSlideToggle")
        .directive('rpSlideToggle', ['timeout', rpSlideToggle]);
})(angular);

