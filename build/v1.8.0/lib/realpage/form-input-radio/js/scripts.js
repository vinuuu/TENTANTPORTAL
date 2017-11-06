//  Source: _lib\realpage\form-input-radio\js\directives\input-radio.js
//  Form Input Radio Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputRadio(timeout, config) {
        function pre(scope, elem, attr) {
            scope.config = scope.config || config();

            if (scope.rpValue) {
                scope.config.data.value = scope.rpValue;
            }
        }

        function post(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                elem.on("change.rpFormInputRadio", dir.onChange);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function () {
                timeout(dir.changeHandler);
            };

            dir.changeHandler = function () {
                scope.config.data.onChange(scope.rpModel);
                scope.rpOnChange();
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.off("change.rpFormInputRadio");
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
                rpValue: "=?",
                rpOnChange: "&",
                rpLabelText: "=?"
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-input-radio/templates/input-radio.html"
        };
    }

    angular
        .module("rpInputRadio")
        .directive("rpFormInputRadio", ["timeout", "rpFormInputRadioConfig", rpFormInputRadio]);
})(angular);

//  Source: _lib\realpage\form-input-radio\js\models\input-radio-config.js
//  Form Input Radio Config

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 1;

        function FormInputRadioConfig() {
            var s = this;
            s.init();
        }

        var p = FormInputRadioConfig.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                value: "",
                name: "radio",
                ngValue: "sample",
                onChange: angular.noop,
                id: "rp-radio-" + index++
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
            return (new FormInputRadioConfig()).setData(data);
        };
    }

    angular
        .module("rpFormInputRadio")
        .factory("rpFormInputRadioConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-input-radio\js\templates\templates.inc.js
angular.module("rpFormInputRadio").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-input-radio/templates/input-radio.html",
"<div class=\"rp-form-input-radio\"><label class=\"rp-form-input-radio-btn\"><input type=\"radio\" ng-model=\"rpModel\" id=\"{{config.data.id}}\" name=\"{{config.data.name}}\" ng-value=\"config.data.value\" ng-change=\"config.data.onChange(rpModel)\"> <i></i></label><label class=\"rp-form-input-radio-label\" for=\"{{config.data.id}}\">{{rpLabelText}}</label></div>");
}]);

