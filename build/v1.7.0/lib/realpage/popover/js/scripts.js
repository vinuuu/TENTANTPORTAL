//  Source: _lib\realpage\popover\js\_bundle.inc
angular.module("rpPopover", []);

//  Source: _lib\realpage\popover\js\directives\popover.js
//  Pop Over Directive

(function (angular) {
    "use strict";

    function rpPopover(timeout) {
        var body,
            index = 0;

        function link(scope, elem, attr) {
            var click,
                dir = {},
                state = {};

            index++;

            dir.init = function () {
                dir.state = state;
                state.active = false;
                body = body || angular.element('body');
                if (attr.rpPopoverId) {
                    click = 'click.inst' + index;
                    scope[attr.rpPopoverId] = dir;
                }
                else {
                    logc(elem);
                    logc('rpPopover: The attribute rp-popover-id is missing!');
                }
            };

            dir.show = function () {
                if (!state.active) {
                    state.active = true;
                    timeout(function () {
                        body.off(click).on(click, dir.hide);
                    });
                }
            };

            dir.hide = function () {
                body.off(click);
                scope.$apply(function () {
                    state.active = false;
                });
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpPopover")
        .directive('rpPopover', ['timeout', rpPopover]);
})(angular);

