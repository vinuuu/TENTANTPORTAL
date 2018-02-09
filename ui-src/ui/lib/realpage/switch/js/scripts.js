//  Source: _lib\realpage\switch\js\directives\switch.js
//  Switch Directive

(function (angular, undefined) {
    "use strict";

    function rpSwitch(timeout, switchConfig) {
        function pre(scope, elem, attr) {
            scope.config = scope.config || switchConfig();
        }

        function post(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.rpSwitch = dir;
            };

            dir.onChange = function () {
                timeout(dir.pubChange);
            };

            dir.pubChange = function () {
                scope.config.data.onChange(scope.rpModel);
                scope.rpOnChange();
            };

            dir.isChecked = function () {
                return scope.rpModel === scope.config.data.trueValue;
            };

            dir.init();
        }

        function compile(elem, attr, trans) {
            return {
                pre: pre,
                post: post
            };
        }

        return {
            scope: {
                config: "=?",
                rpModel: "=",
                rpOnChange: "&",
                rpLabelText: "=?",
                rpFieldName: "=?"
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/switch/templates/index.html"
        };
    }

    angular
        .module("rpSwitch")
        .directive("rpSwitch", ["timeout", "rpSwitchConfig", rpSwitch]);
})(angular);

//  Source: _lib\realpage\switch\js\models\switch-config.js
//  Switch Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 1;

        function SwitchConfig() {
            var s = this;
            s.init();
        }

        var p = SwitchConfig.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                trueValue: true,
                falseValue: false,
                onChange: angular.noop,
                id: "rp-switch-" + index++
            };
        };

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new SwitchConfig()).setData(data);
        };
    }

    angular
        .module("rpSwitch")
        .factory("rpSwitchConfig", [factory]);
})(angular);

//  Source: _lib\realpage\switch\js\templates\templates.inc.js
angular.module("rpSwitch").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/switch/templates/index.html",
"<div class=\"rp-switch\" ng-class=\"{checked: rpSwitch.isChecked()}\"><label class=\"rp-switch-label\" for=\"{{config.data.id}}\">{{rpLabelText}}</label><label class=\"ui-switch\"><input type=\"checkbox\" ng-model=\"rpModel\" id=\"{{config.data.id}}\" name=\"{{::rpFieldName}}\" ng-change=\"rpSwitch.onChange(rpModel)\" ng-true-value=\"{{config.data.trueValue}}\" ng-false-value=\"{{config.data.falseValue}}\"> <i></i></label></div>");
}]);
