angular.module("rpFormSelectMenu", []);

//  Source: _lib\realpage\form-select-menu-v1\js\templates\templates.inc.js
angular.module("rpFormSelectMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-select-menu-v1/templates/form-select-menu.html",
"<div class=\"rp-select-menu\" ng-class=\"menu.getState()\"><span ng-if=\"configData.readonly\" class=\"rp-select-menu-readonly\" title=\"{{menu.getDisplayText()}}\"></span><select class=\"rp-form-select-field\" id=\"{{::configData.id}}\" name=\"{{::configData.fieldName}}\" ng-blur=\"menu.onBlur()\" ng-change=\"menu.onChange(rpModel)\" ng-disabled=\"configData.disabled\" ng-focus=\"menu.onFocus()\" ng-model-options=\"configData.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"menu.onMouseout()\" ng-mouseover=\"menu.onMouseover()\" ng-options=\"option.value as option.name group by option.group for option in configData.options | rpFormSelectMenuFilter: configData\" ng-readonly=\"configData.readonly\" ng-required=\"configData.required\" title=\"{{menu.getDisplayText()}}\"></select><div class=\"rp-select-menu-inner\"><span title=\"{{menu.getDisplayText()}}\" class=\"rp-select-menu-value\">{{menu.getDisplayText()}} {{config.getType(menu)}}</span></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in configData.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

//  Source: _lib\realpage\form-select-menu-v1\js\models\form-select-menu.js
//  Select Menu Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var inst = 1;

        function SelectMenuConfig() {
            var s = this;
            s.init();
        }

        var p = SelectMenuConfig.prototype;

        p.init = function () {
            var s = this;
            s._id = inst++;
            s._name = "SelectMenuConfig";

            s.keys = [];
            s.fieldId = "select-menu-" + inst;

            s.data = {
                size: "",
                options: [],
                disabled: false,
                displayText: "",
                dynamicDisplayText: true,
                errorMsgs: [
                    // {
                    //     name: "sample",
                    //     text: "Sample validation error message"
                    // }
                ],
                fieldName: s.fieldId,
                id: s.fieldId,
                modelOptions: {
                    allowInvalid: true,
                    updateOn: "default"
                },
                nameKey: "name",
                onChange: angular.noop,
                readonly: false,
                required: false,
                valueKey: "value",
                groupKey: "group",
                asyncValidators: {

                },
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                optionsFilter: {}
            };

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getOptionName = function (optionValue) {
            var name,
                s = this;

            s.data.options.forEach(function (option) {
                if (option.value === optionValue) {
                    name = option.name;
                }
            });

            return name;
        };

        p.getOptionValue = function (optionName) {
            var value,
                s = this;

            s.data.options.forEach(function (option) {
                if (option.value === optionName) {
                    value = option.value;
                }
            });

            return value;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.setOptions = function (options) {
            var s = this;
            s.flushOptions().addOptions(options);
            return s;
        };

        p.setOptionsFilter = function (filter) {
            var s = this;
            s.data.optionsFilter = filter;
            return s;
        };

        // Assertions

        p.isValidOption = function (option) {
            var s = this;
            return option &&
                option[s.data.nameKey] !== undefined &&
                option[s.data.valueKey] !== undefined &&
                s.keys.indexOf(option[s.data.nameKey]) == -1;
        };

        p.hasErrorMsgs = function () {
            var s = this;
            return s.data.errorMsgs && !s.data.errorMsgs.empty();
        };

        p.hasGroupKey = function (option) {
            var s = this;
            return s.data.groupKey !== undefined &&
                option[s.data.groupKey] !== undefined;
        };

        // Actions

        p.addOptions = function (options) {
            var s = this;

            if (options && options.push) {
                options.forEach(s.addOption.bind(s));
            }
            else {
                logc("rpFormSelectMenuConfig.addOptions: options should be an array!");
            }

            return s;
        };

        p.addOption = function (option) {
            var s = this;

            if (s.isValidOption(option)) {
                s.keys.push(option[s.data.nameKey]);

                var newOption = {
                    name: option[s.data.nameKey],
                    value: option[s.data.valueKey]
                };

                if (s.hasGroupKey(option)) {
                    newOption.group = option[s.data.groupKey];
                }

                s.data.options.push(newOption);
            }

            return s;
        };

        p.flushOptions = function () {
            var s = this;
            s.keys.flush();
            s.data.options.flush();
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.flushOptions();
            s.data = undefined;
            return s;
        };

        return function (data) {
            return (new SelectMenuConfig()).setData(data);
        };
    }

    angular
        .module("rpFormSelectMenu")
        .factory("rpFormSelectMenuConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\directives\form-select-menu.js
//  Select Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpFormSelectMenu(timeout) {
        function pre(scope, elem, attr) {
            scope.configData = scope.config.getData();

            if (scope.config.hasErrorMsgs()) {
                elem.addClass("has-error-msgs");
            }
        }

        function compile(elem, attr, trans) {
            return {
                pre: pre,
                post: angular.noop
            };
        }

        return {
            scope: {
                config: "=",
                rpModel: "="
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-select-menu-v1/templates/form-select-menu.html"
        };
    }

    angular
        .module("rpFormSelectMenu")
        .directive("rpFormSelectMenu", ["timeout", rpFormSelectMenu]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\directives\form-select-field.js
//  Select Field Directive

(function (angular, undefined) {
    "use strict";

    function rpFormSelectField(timeout) {
        function link(scope, elem, attr, ctrl) {
            var dir = {},
                config = scope.config,
                configData = scope.configData;

            dir.init = function () {
                dir.state = {
                    hover: false,
                    focus: false
                };

                dir.errorState = {};

                if (configData.size) {
                    dir.state[configData.size] = true;
                }

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, configData.validators);
                }

                if (dir.hasAsyncValidators()) {
                    angular.extend(ctrl.$asyncValidators, configData.asyncValidators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });

                dir.destWatch = scope.$on("$destroy", dir.destroy);

                scope.menu = dir;
            };

            dir.hasAsyncValidators = function () {
                return configData.asyncValidators &&
                    Object.keys(configData.asyncValidators).length !== 0;
            };

            dir.hasValidators = function () {
                return configData.validators &&
                    Object.keys(configData.validators).length !== 0;
            };

            dir.getState = function () {
                angular.extend(dir.state, {
                    dirty: ctrl.$dirty,
                    error: ctrl.$invalid,
                    touched: ctrl.$touched,
                    readonly: configData.readonly,
                    disabled: configData.disabled
                }, dir.errorState, ctrl.$error);

                configData.errorMsgs.forEach(function (msg) {
                    msg.active = ctrl.$error[msg.name];
                });

                return dir.state;
            };

            dir.onFocus = function () {
                dir.state.focus = true;
            };

            dir.onBlur = function () {
                dir.state.focus = false;
            };

            dir.onMouseover = function () {
                dir.state.hover = true;
            };

            dir.onMouseout = function () {
                dir.state.hover = false;
            };

            dir.onChange = function (data) {
                var onChange = configData.onChange;

                if (onChange) {
                    if (typeof onChange == "function") {
                        dir.timer = timeout(function () {
                            onChange(data);
                        });
                    }
                    else {
                        logw("rpFormSelectMenu: onChange callback is not a function!");
                    }
                }
            };

            dir.getDisplayText = function () {
                if (configData.dynamicDisplayText) {
                    return config.getOptionName(scope.rpModel);
                }
                else {
                    return configData.displayText;
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                timeout.cancel(dir.timer);
                dir = undefined;
                ctrl = undefined;
                config = undefined;
                configData = undefined;
                scope.menu = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C",
            require: "ngModel"
        };
    }

    angular
        .module("rpFormSelectMenu")
        .directive("rpFormSelectField", ["timeout", rpFormSelectField]);
})(angular);

//  Source: _lib\realpage\form-select-menu-v1\js\filters\form-select-menu.js
// Select Menu Filter

(function (angular) {
    "use strict";

    function filter($filter) {
        return function filter(options, config) {
            var filtered,
                newOptions = [];

            options = options.filter(function (option) {
                if (option.value === "") {
                    newOptions = [option];
                }
                return option.value !== "";
            });

            if (angular.isFunction(config.optionsFilter)) {
                filtered = config.optionsFilter(options);
            }
            else {
                filtered = $filter("filter")(options, config.optionsFilter);
            }

            return newOptions.concat(filtered);
        };
    }

    angular
        .module("rpFormSelectMenu")
        .filter("rpFormSelectMenuFilter", ["$filter", filter]);
})(angular);
