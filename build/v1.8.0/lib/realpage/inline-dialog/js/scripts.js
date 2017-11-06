//  Source: _lib\realpage\inline-dialog\js\_bundle.inc
angular.module("rpInlineDialog", []);

//  Source: _lib\realpage\inline-dialog\js\directives\inline-dialog.js
// Inline Dialog Directive

(function (angular) {
    "use strict";

    function rpInlineDialog(device) {
        var body,
            trigger = '.rp-inline-dialog-trigger:first',
            content = '.rp-inline-dialog-content:first',
            index = 0;

        function link(scope, element, attrs) {
            index++;

            var dir = {},
                instName = 'rpInlineDialog' + index,
                watch1 = angular.noop;

            dir.init = function () {
                body = angular.element('body');

                dir.trigger = element.find(trigger);
                dir.content = element.find(content);
                dir.openState = false;

                dir.exposeInstance();
                dir.click = device.clickEvent(dir.instName);

                dir.trigger.on(dir.click, dir.onClick);
                dir.watch1 = scope.$on('$destroy', dir.destroy);
            };

            dir.exposeInstance = function () {
                dir.instName = attrs.rpInstanceName || instName;
                scope[dir.instName] = dir;
                return dir;
            };

            dir.onClick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (!dir.openState) {
                    dir.show();
                }
                else {
                    dir.hide();
                }
            };

            dir.show = function () {
                body.on(dir.click, dir.hide);
                dir.content.addClass('on');
                dir.toggleState();
                return dir;
            };

            dir.hide = function () {
                body.off(dir.click);
                dir.content.removeClass('on');
                dir.toggleState();
                return dir;
            };

            dir.toggleState = function () {
                dir.openState = !dir.openState;
                return dir;
            };

            dir.destroy = function () {
                dir.watch1();
                dir = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpInlineDialog")
        .directive('rpInlineDialog', [
			'deviceInfoSvc',
			rpInlineDialog
		]);
})(angular);

