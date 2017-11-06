angular.module("rpToggle", []);

//  Source: _lib\realpage\toggle\js\templates\templates.inc.js
angular.module("rpToggle").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/toggle/templates/toggle.html",
"<span ng-click=\"dir.toggle($event)\" ng-class=\"dir.getState()\" class=\"rp-toggle\"><i class=\"icon\" ng-class=\"dir.getIconState()\"></i> <span class=\"text active\">{{options.activeText}} </span><span class=\"text inactive\">{{options.defaultText}}</span></span>");
}]);

//  Source: _lib\realpage\toggle\js\directives\toggle.js
//  Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpToggle(timeout) {
        var body,
            index = 1;

        function link(scope, elem, attr) {
            index++;

            var dir = {},
                options = scope.options || {},
                click = "click.rpToggle" + index;

            dir.init = function () {
                scope.dir = dir;
                body = body || angular.element("body");
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.toggle = function (ev) {
                if (options && options.preventDefault) {
                    ev.preventDefault();
                }

                if (options && options.bodyToggle && !scope.model) {
                    scope.model = true;

                    timeout(function () {
                        body.off(click).on(click, dir.hide);
                    });
                }
                else {
                    scope.model = !scope.model;
                }
            };

            dir.getState = function () {
                var state = {
                    on: scope.model
                };

                if (options.defaultClass) {
                    state[options.defaultClass] = scope.model;
                }

                if (options.activeClass) {
                    state[options.activeClass] = !scope.model;
                }

                return state;
            };

            dir.getIconState = function () {
                var state = {};

                if (options.defaultIconClass) {
                    state[options.defaultIconClass] = scope.model;
                }

                if (options.activeIconClass) {
                    state[options.activeIconClass] = !scope.model;
                }

                return state;
            };

            dir.hide = function () {
                body.off(click);
                scope.$apply(function () {
                    scope.model = false;
                });
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
                options = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "=",
                options: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/toggle/templates/toggle.html"
        };
    }

    angular
        .module("rpToggle")
        .directive("rpToggle", ["timeout", rpToggle]);
})(angular);

