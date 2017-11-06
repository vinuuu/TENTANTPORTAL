//  Source: _lib\realpage\callout\js\_bundle.inc
angular.module("rpCallout", []);

//  Source: _lib\realpage\callout\js\directives\callout.js
//  Callout Directive

(function (angular) {
    "use strict";

    function rpCallout(timeout) {
        var index = 1;

        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.isVisible = false;
                dir.body = angular.element('body');
                dir.click = 'click.rpCallout' + index++;
                dir.name = dir.getModel().name || ('rpCallout' + index);
                scope[dir.name] = dir;
            };

            dir.getModel = function () {
                return scope.$eval(attr.rpCallout);
            };

            dir.toggle = function () {
                dir[dir.isVisible ? 'hide' : 'show']();
            };

            dir.show = function () {
                elem.show();
                dir.isVisible = true;
                timeout(dir.bindHide);
            };

            dir.hide = function () {
                elem.hide();
                dir.isVisible = false;
                dir.body.off(dir.click);
            };

            dir.bindHide = function () {
                dir.body.on(dir.click, dir.hide);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpCallout")
        .directive('rpCallout', ['timeout', rpCallout]);
})(angular);

