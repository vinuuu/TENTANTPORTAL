//  Source: _lib\realpage\form-input-checkbox\js\directives\form-input-checkbox.js
//  Form Input Checkbox Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputCheckbox($timeout, checkboxConfig) {
        function pre(scope, elem, attr) {
            scope.config = scope.config || checkboxConfig();
        }

        function post(scope, elem, attr) {
            var dir = {},
                config = scope.config;

            dir.init = function () {
                scope.checkbox = dir;

                dir.state = {
                    "has-label": scope.rpLabelText !== undefined
                };

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function () {
                $timeout(dir.evalOnChange);
            };

            dir.evalOnChange = function () {
                scope.rpOnChange();
                scope.config.data.onChange(scope.rpModel);
            };

            dir.destroy = function () {
                dir.destWatch();
                delete scope.checkbox;

                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
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
                rpModel: "=",
                config: "=?",
                rpOnChange: "&",
                rpLabelText: "=?"
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-input-checkbox/templates/input-checkbox.html"
        };
    }

    angular
        .module("rpFormInputCheckbox")
        .directive("rpFormInputCheckbox", [
            "$timeout",
            "rpFormInputCheckboxConfig",
            rpFormInputCheckbox
        ]);
})(angular);

//  Source: _lib\realpage\form-input-checkbox\js\models\form-input-checkbox-config.js
//  Form Input Checkbox Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 1;

        function FormInputCheckboxConfig() {
            var s = this;
            s.init();
        }

        var p = FormInputCheckboxConfig.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                trueValue: true,
                falseValue: false,
                onChange: angular.noop,
                id: "rp-checkbox-" + index++
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
            return (new FormInputCheckboxConfig()).setData(data);
        };
    }

    angular
        .module("rpFormInputCheckbox")
        .factory("rpFormInputCheckboxConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-input-checkbox\js\templates\templates.inc.js
angular.module("rpFormInputCheckbox").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-input-checkbox/templates/input-checkbox.html",
"<div class=\"rp-form-input-checkbox\" ng-class=\"checkbox.state\"><label class=\"rp-form-input-checkbox-btn\"><input type=\"checkbox\" ng-model=\"rpModel\" id=\"{{config.data.id}}\" name=\"{{config.data.name}}\" ng-value=\"config.data.value\" ng-change=\"checkbox.onChange(rpModel)\"> <i></i></label><label class=\"rp-form-input-checkbox-label\" for=\"{{config.data.id}}\">{{rpLabelText}}</label></div>");
}]);

