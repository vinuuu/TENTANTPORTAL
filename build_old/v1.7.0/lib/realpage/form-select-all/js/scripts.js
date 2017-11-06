//  Source: _lib\realpage\form-select-all\js\_bundle.inc
angular.module("rpFormSelectAll", []);

//  Source: _lib\realpage\form-select-all\js\templates\select-all.js
//  Select All Checkbox Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/form/select-all/select-all.html";

    templateHtml = "" +

    "<div class='rp-select-all-checkbox' ng-class='model.getState()' " +
        "ng-click='model.toggleSelectAll()'>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('rpFormSelectAll')
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\form-select-all\js\models\select-all.js
//  Select All Model

(function (angular) {
    "use strict";

    function factory() {
        function svc() {
            var model;

            model = {
                list: [],
                selectKey: 'key',
                trueValue: true,
                falseValue: false
            };

            //  Setters API

            model.setList = function (list) {
                model.list = list;
                return model;
            };

            model.setSelectKey = function (selectKey) {
                model.selectKey = selectKey;
                return model;
            };

            model.setTrueValue = function (trueValue) {
                model.trueValue = trueValue;
                return model;
            };

            model.setFalseValue = function (falseValue) {
                model.falseValue = falseValue;
                return model;
            };

            //  Internals

            model.toggleSelectAll = function () {
                var val = !model.allSelected() ? model.trueValue : model.falseValue;
                model.list.forEach(function (listItem) {
                    listItem[model.selectKey] = val;
                });
            };

            model.allSelected = function () {
                var count = 0;

                model.list.forEach(function (listItem) {
                    if (listItem[model.selectKey] === model.trueValue) {
                        count++;
                    }
                });

                return count === model.list.length;
            };

            //  Getters

            model.getState = function () {
                return {
                    checked: model.allSelected()
                };
            };

            return model;
        }

        return svc;
    }

    angular
        .module('rpFormSelectAll')
        .factory('rpSelectAllModel', [factory]);
})(angular);

//  Source: _lib\realpage\form-select-all\js\directives\select-all.js
//  Select All Checkbox Directive

(function (angular) {
    "use strict";

    function rpSelectAll() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/form/select-all/select-all.html"
        };
    }

    angular
        .module('rpFormSelectAll')
        .directive('rpSelectAll', [rpSelectAll]);
})(angular);

