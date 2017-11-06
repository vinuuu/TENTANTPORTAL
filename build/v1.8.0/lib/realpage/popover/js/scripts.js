//  Source: _lib\realpage\popover\js\directives\popover.js
//  Popover Directive

(function (angular, undefined) {
    "use strict";

    function rpPopover($popover) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.options = scope.$eval(attr.rpPopover);
                scope[dir.options.instName] = dir;
                dir.popover = $popover(elem, dir.options);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.show = function () {
                dir.popover.show();
            };

            dir.hide = function () {
                dir.popover.hide();
            };

            dir.destroy = function () {
                dir.destWatch();
                delete scope[dir.options.instName];

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
        .module("rpPopover")
        .directive("rpPopover", ["$popover", rpPopover]);
})(angular);

//  Source: _lib\realpage\popover\js\models\popover.js
//  Popover Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var defConfig = {
            animation: "am-fade",
            placement: "right",
            trigger: "click",
            title: "",
            content: "",
            html: false,
            delay: {
                show: 0,
                hide: 0
            },
            container: false,
            target: false,
            template: "",
            templateUrl: "popover/popover.tpl.html",
            contentTemplate: false,
            autoClose: false,
            id: "",
            keyboard: false,
            onShow: angular.noop,
            onHide: angular.noop,
            onBeforeHide: angular.noop,
            viewport: {
                padding: 0,
                selector: "body"
            }
        };

        return function (data) {
            return angular.extend({}, defConfig, data || {});
        };
    }

    angular
        .module("rpPopover")
        .factory("rpPopoverConfig", [factory]);
})(angular);

