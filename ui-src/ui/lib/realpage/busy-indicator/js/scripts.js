angular.module("rpBusyIndicator", []);

//  Source: _lib\realpage\busy-indicator\js\directives\busy-indicator.js
//  Busy Indicator Directive

(function (angular, undefined) {
    "use strict";

    function rpBusyIndicator() {
        function link(scope, elem, attr) {
            if (!scope.model) {
                logw("rpBusyIndicator: Model is undefined!");
            }
        }

        return {
            scope: {
                model: "=?"
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/busy-indicator/templates/busy-indicator.html"
        };
    }

    angular
        .module("rpBusyIndicator")
        .directive("rpBusyIndicator", [
            "cdnVer",
            "timeout",
            "eventStream",
            rpBusyIndicator
        ]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\models\busy-indicator-model.js
//  Busy Indicator Model Service

(function (angular, undefined) {
    "use strict";

    var fn = angular.noop;

    function service() {
        function BusyIndicatorConfigModel() {
            var s = this;
            s.init();
        }

        var p = BusyIndicatorConfigModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            s.msg = "Loading...";
            return s;
        };

        p.setMsg = function (msg) {
            var s = this;
            s.msg = msg;
            return s;
        };

        p.busy = function () {
            var s = this;
            s.data.busy = true;
            return s;
        };

        p.error = function () {
            var s = this;

            return s;
        };

        p.off = function () {
            var s = this;
            s.data.busy = false;
            return s;
        };

        p.toggleTheme = function (themeName) {
            var s = this;
            if (themeName) {
                s.data[themeName] = !s.data[themeName];
            }
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.msg = undefined;
            s.data = undefined;
            return s;
        };

        return function (themeName) {
            return (new BusyIndicatorConfigModel()).toggleTheme(themeName);
        };
    }

    angular
        .module("rpBusyIndicator")
        .factory("rpBusyIndicatorModel", [service]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\templates\templates.inc.js
angular.module("rpBusyIndicator").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/busy-indicator/templates/busy-indicator.html",
"<div class=\"rp-busy-indicator\" ng-class=\"model.data\"><div class=\"raul-loading-dots\"><span class=\"raul-loading-dot\"></span> <span class=\"raul-loading-dot\"></span> <span class=\"raul-loading-dot\"></span> <span class=\"rp-busy-indicator-msg\">{{model.msg}}</span></div></div>");
}]);
