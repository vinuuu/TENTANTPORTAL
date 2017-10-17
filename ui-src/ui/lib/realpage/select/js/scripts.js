angular.module("rpSelect", []);

//  Source: _lib\realpage\select\js\directives\select.js
//  Select Directive

(function (angular) {
    "use strict";

    function rpSelect($compile, selectTemplate) {
        function link(scope, elem, attr) {
            var data = scope.config.getData(),
                template = selectTemplate(data).getTemplate();

            elem.html(template);
            $compile(elem.contents())(scope);
        }

        return {
            scope: {
                model: "=",
                config: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-select' ng-class='config.getState()'></div>"
        };
    }

    angular
        .module("rpSelect")
        .directive("rpSelect", [
            "$compile",
            "rpSelectTemplate",
            rpSelect
        ]);
})(angular);

//  Source: _lib\realpage\select\js\directives\select-link.js
//  Select Link Directive

(function (angular) {
    "use strict";

    function rpSelectLink() {
        function link(scope, elem, attr, ctrl) {
            var model,
                dir = {};

            dir.init = function () {
                model = scope.$eval(attr.rpSelectLink);
                model.addStateProvider(dir.getState);
                angular.extend(ctrl.$validators, model.getValidators());
            };

            dir.getState = function () {
                return angular.extend({}, ctrl.$error);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A",
            require: "ngModel"
        };
    }

    angular
        .module("rpSelect")
        .directive("rpSelectLink", [rpSelectLink]);
})(angular);

//  Source: _lib\realpage\select\js\models\select.js
//  Select Config Model

(function (angular) {
    "use strict";

    function factory() {
        function SelectConfig() {
            var s = this;
            s.init();
        }

        var p = SelectConfig.prototype;

        p.init = function () {
            var s = this;

            s.stateProviders = [];

            s.data = {
                appendToBody: true,
                closeOnSelect: true,
                disabled: false,
                displayDataKey: "name",
                errorMsgs: [],
                groupBy: "",
                limit: undefined,
                multiple: false,
                onChange: angular.noop,
                onClose: angular.noop,
                onHighlight: angular.noop,
                onOpen: angular.noop,
                onRemove: angular.noop,
                onSelect: angular.noop,
                options: [],
                optionsFilter: "filter: $select.search",
                optionTemplateUrl: "realpage/select/templates/select-option.html",
                refreshCallback: "",
                refreshDelay: 0,
                required: false,
                resetSearchInput: false,
                searchPlaceholder: "search...",
                selectedMatchTemplate: "{{$select.selected[config.data.displayDataKey]}}",
                showClearButton: false,
                size: "",
                theme: "bootstrap",
                trackBy: "$index",
                validators: {}
            };

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getErrorMsgs = function () {
            var s = this;
            return s.data.errorMsgs;
        };

        p.getOptions = function () {
            var s = this;
            return s.data.options;
        };

        p.getState = function () {
            var s = this,
                state = {},
                errorDetected = false;

            s.stateProviders.forEach(function (stateProvider) {
                angular.extend(state, stateProvider());
            });

            s.data.errorMsgs.forEach(function (msg) {
                if (!errorDetected) {
                    msg.active = state[msg.name];
                    errorDetected = state[msg.name];
                }
            });

            if (Object.keys(state).length > 0) {
                state.error = true;
            }

            return state;
        };

        p.getValidators = function () {
            var s = this;
            return s.data.validators;
        };

        // Setters

        p.setOptions = function (options) {
            var s = this;
            s.data.options = options;
            return s;
        };

        // Actions

        p.addStateProvider = function (stateProvider) {
            var s = this;
            s.stateProviders.push(stateProvider);
            return s;
        };

        p.clearSelection = function (model) {
            var s = this;
            model.selected = undefined;
            return s;
        };

        p.disable = function () {
            var s = this;
            s.data.disabled = true;
            return s;
        };

        p.enable = function () {
            var s = this;
            s.data.disabled = false;
            return s;
        };

        p.extend = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        // Assertions

        p.isDisabled = function () {
            var s = this;
            return s.data.disabled;
        };

        return function (data) {
            var inst = new SelectConfig();
            return inst.extend(data);
        };
    }

    angular
        .module("rpSelect")
        .factory("rpSelectConfig", [factory]);
})(angular);

//  Source: _lib\realpage\select\js\models\select-template.js
//  Select Template Model

(function (angular) {
    "use strict";

    function factory(cache) {
        function RpSelectTemplate() {
            var s = this;
            s.init();
        }

        var p = RpSelectTemplate.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.value = "";
            s.data = data || {};
            return s;
        };

        // Getters

        p.getGroupBy = function () {
            var s = this;
            return s.data.groupBy ? "group-by='config.data.groupBy' " : "";
        };

        p.getLimit = function () {
            var s = this;
            return s.data.limit !== undefined ? "limit='" + s.data.limit + "' " : "";
        };

        p.getMultiple = function () {
            var s = this;
            return s.data.multiple ? "multiple " : "";
        };

        p.getOptionsFilter = function () {
            var s = this;
            return s.data.optionsFilter ? " | " + s.data.optionsFilter : "";
        };

        p.getOptionTemplate = function () {
            var s = this;
            return cache.get(s.data.optionTemplateUrl);
        };

        p.getRefresh = function () {
            var s = this,
                refresh = "refresh='config.data.refreshCallback($select.search)' ";
            return s.data.refreshCallback ? refresh : "";
        };

        p.getRefreshDelay = function () {
            var s = this,
                refreshDelay = "refresh-delay='{{config.data.refreshDelay}}' ";
            return s.data.refreshDelay ? refreshDelay : "";
        };

        p.getRepeat = function () {
            var s = this,
                repeat = "repeat='option in config.data.options";
            return repeat + s.getOptionsFilter() + s.getTrackBy() + "'" ;
        };

        p.getTrackBy = function () {
            var s = this;
            return s.data.trackBy ? " track by " + s.data.trackBy : "";
        };

        p.getTemplate = function () {
            var s = this;

            return "" +

            "<div class='rp-select-table'>" +
                "<div class='rp-select-cell'>" +
                    "<ui-select " +
                        s.getTheme() +
                        s.getLimit() +
                        s.getMultiple() +
                        "rp-select-link='config' " +
                        "ng-model='model.selected' " +
                        "class='rp-select-container' " +
                        "ng-disabled='config.data.disabled' " +
                        "ng-required='config.data.required' " +
                        "append-to-body='{{config.data.appendToBody}}' " +
                        "close-on-select='{{config.data.closeOnSelect}}' " +
                        "on-remove='config.data.onRemove($item, $model)' " +
                        "on-select='config.data.onSelect($item, $model)' " +
                        "ng-change='config.data.onChange($select.selected)' " +
                        "reset-search-input='{{config.data.resetSearchInput}}'>" +
                        "<ui-select-match " +
                            "class='rp-select-match' " +
                            "placeholder='{{config.data.searchPlaceholder}}'>" +
                            s.data.selectedMatchTemplate +
                        "</ui-select-match>" +
                        "<ui-select-choices " +
                            s.getGroupBy() +
                            s.getRefresh() +
                            s.getRefreshDelay() +
                            s.getRepeat() +
                            "class='rp-select-choices' " +
                            "on-highlight='config.data.onHighlight(option)'>" +
                            s.getOptionTemplate() +
                        "</ui-select-choices>" +
                    "</ui-select>" +
                "</div>" +
                "<span ng-if='config.data.showClearButton' " +
                    "class='rp-select-clear rp-select-cell' " +
                    "ng-click='config.clearSelection(model)'>" +
                "</span>" +
            "</div>" +
            "<ul class='rp-form-error-msgs'>" +
                "<li ng-if='msg.active' " +
                    "class='rp-form-error-msg' " +
                    "ng-repeat='msg in config.data.errorMsgs'>" +
                    "{{msg.text}}" +
                "</li>" +
            "</ul>";
        };

        p.getTheme = function () {
            var s = this;
            return "theme='" + s.data.theme + "' ";
        };

        return function (data) {
            var inst = new RpSelectTemplate();
            return inst.setData(data);
        };
    }

    angular
        .module("rpSelect")
        .factory("rpSelectTemplate", ["$templateCache", factory]);
})(angular);

//  Source: _lib\realpage\select\js\templates\templates.inc.js
angular.module('rpSelect').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/select/templates/select-option.html",
"<span class=\"rp-select-option-text\" ng-bind-html=\"option[config.data.displayDataKey] | highlight: $select.search\"></span>");
}]);

