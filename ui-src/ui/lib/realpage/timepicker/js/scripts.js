//  Source: _lib\realpage\timepicker\js\directives\timepicker.js
//  Timepicker Directive

(function (angular, undefined) {
    "use strict";

    function rpTimepicker(timepickerConfig) {
        function compile() {
            return {
                pre: function (scope) {
                    scope.config = scope.config || timepickerConfig();
                }
            };
        }

        return {
            scope: {
                config: "=?",
                rpModel: "=",
                rpOnHide: "&"
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/timepicker/templates/timepicker.html"
        };
    }

    angular
        .module("rpTimepicker")
        .directive("rpTimepicker", ["rpTimepickerConfig", rpTimepicker]);
})(angular);

//  Source: _lib\realpage\timepicker\js\models\timepicker-config.js
//  Timepicker Config Model

(function (angular, undefined) {
    "use strict";

    function factory(options) {
        function TimepickerConfig() {
            var s = this;
            s.init();
        }

        var p = TimepickerConfig.prototype;

        p.init = function () {
            var s = this;
            s.options = options();
        };

        p.getOptions = function () {
            var s = this;
            return s.options;
        };

        p.setOptions = function (options) {
            var s = this;
            s.options = options || s.options;
            return s;
        };

        p.updateOptions = function (options) {
            var s = this;
            angular.extend(s.options, options || {});
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.options = undefined;
        };

        return function (options) {
            return (new TimepickerConfig()).setOptions(options);
        };
    }

    angular
        .module("rpTimepicker")
        .factory("rpTimepickerConfig", ["rpTimepickerOptions", factory]);
})(angular);

//  Source: _lib\realpage\timepicker\js\models\timepicker-options.js
//  Timepicker Options Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 0;

        return function () {
            index++;

            return {
                "animation": "am-fade",
                "arrowBehavior": "pager",
                "autoclose": false,
                "container": false,
                "delay": 0,
                "hourStep": 1,
                "html": false,
                "id": "timepicker-" + index,
                "iconDown": "glyphicon glyphicon-chevron-down",
                "iconUp": "glyphicon glyphicon-chevron-up",
                "length": 5,
                "maxTime": +Infinity,
                "minTime": -Infinity,
                "minuteStep": 1,
                "modelTimeFormat": null,
                "name": "timepicker" + index,
                "onBeforeHide": angular.noop,
                "onBeforeShow": angular.noop,
                "onHide": angular.noop,
                "onShow": angular.noop,
                "placement": "bottom-left",
                "roundDisplay": false,
                "secondStep": 1,
                "templateUrl": "timepicker/timepicker.tpl.html",
                "timeFormat": "hh:mm a",
                "timeType": "date",
                "trigger": "focus",
                "useNative": true
            };
        };
    }

    angular
        .module("rpTimepicker")
        .factory("rpTimepickerOptions", [factory]);
})(angular);

//  Source: _lib\realpage\timepicker\js\templates\templates.inc.js
angular.module("rpTimepicker").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/timepicker/templates/timepicker.html",
"<div class=\"rp-timepicker form-group\"><input type=\"text\" bs-timepicker ng-model=\"rpModel\" id=\"{{::config.options.id}}\" name=\"{{::config.options.name}}\" class=\"form-control rp-timepicker-link\" data-max-time=\"{{config.options.minTime}}\" data-min-time=\"{{config.options.minTime}}\" data-autoclose=\"{{::config.options.autoclose}}\" data-minute-step=\"{{::config.options.minuteStep}}\" data-time-format=\"{{::config.options.timeFormat}}\" data-arrow-behavior=\"{{::config.options.arrowBehavior}}\"></div>");
}]);
