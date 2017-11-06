//  Source: _lib\realpage\date-range\js\_bundle.inc
angular.module("rpDateRange", []);

//  Source: _lib\realpage\date-range\js\directives\date-range.js
//  Date Range Directive

(function (angular) {
    "use strict";

    function rpDateRange() {
        function link(scope, elem, attr) {
            var endOptions,
                startOptions,
                defaultOptions;

            defaultOptions = {
                maxLength: 10,
                anchorRight: false,
                displayFormat: 'MM/DD/YY'
            };

            endOptions = {
                min: scope.range.startDate
            };

            startOptions = {
                max: scope.range.endDate
            };

            scope.endOptions = angular.extend({}, defaultOptions, scope.options, endOptions);
            scope.startOptions = angular.extend({}, defaultOptions, scope.options, startOptions);

            scope.$watchGroup(['range.startDate', 'range.endDate'], function (newVal) {
                scope.endOptions.min = newVal[0];
                scope.startOptions.max = newVal[1];
            });
        }

        return {
            scope: {
                range: '=',
                options: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/form/date-range/date-range.html"
        };
    }

    angular
        .module("rpDateRange")
        .directive('rpDateRange', [rpDateRange]);
})(angular);

//  Source: _lib\realpage\date-range\js\templates\date-range.js
//  Date Range Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/form/date-range/date-range.html";

    templateHtml = "" +
        "<div class='rp-date-range'>" +
            "<rp-input-date " +
                "model='range.startDate' " +
                "options='startOptions'>" +
            "</rp-input-date>" +

            "<span class='to'>-</span>" +

            "<rp-input-date " +
                "model='range.endDate' " +
                "options='endOptions'>" +
            "</rp-input-date>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpDateRange")
        .run(['$templateCache', installTemplate]);
})(angular);

