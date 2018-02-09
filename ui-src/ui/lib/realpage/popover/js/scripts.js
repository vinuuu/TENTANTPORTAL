//  Source: _lib\realpage\popover\js\directives\popover.js
//  Popover Directive

(function (angular, undefined) {
    "use strict";

    function rpPopover($popover, $parse) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.options = scope.$eval(attr.rpPopover);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.updateReference().popover = $popover(elem, dir.options);
                dir.popover.$scope.rpPopoverOptions = dir.options;
            };

            dir.updateReference = function () {
                var ref = $parse(dir.options.instName);
                ref.assign(scope, dir);
                return dir;
            };

            dir.show = function () {
                dir.popover.show();
            };

            dir.hide = function () {
                dir.popover.hide();
            };

            dir.toggle = function () {
                dir.popover.toggle();
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
        .directive("rpPopover", ["$popover", "$parse", rpPopover]);
})(angular);

//  Source: _lib\realpage\popover\js\models\popover.js
//  Popover Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 1;

        function newConfig() {
            var instName = "rpPopover" + index++;

            return {
                animation: "am-fade",
                autoClose: false,
                container: false,
                content: "",
                contentTemplate: false,
                delay: {
                    show: 0,
                    hide: 0
                },
                html: false,
                id: "",
                instName: instName,
                keyboard: false,
                onBeforeHide: angular.noop,
                onHide: angular.noop,
                onShow: angular.noop,
                placement: "right",
                target: false,
                template: "",
                templateUrl: "popover/popover.tpl.html",
                title: "",
                trigger: "click",
                viewport: {
                    padding: 0,
                    selector: "body"
                }
            };
        }

        return function (data) {
            return angular.extend(newConfig(), data || {});
        };
    }

    angular
        .module("rpPopover")
        .factory("rpPopoverConfig", [factory]);
})(angular);
