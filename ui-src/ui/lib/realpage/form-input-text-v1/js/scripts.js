//  Source: _lib\realpage\form-input-text-v1\js\_bundle.inc
angular.module("rpFormInputText", []);

//  Source: _lib\realpage\form-input-text-v1\js\directives\form-input-text-field.js
//  Form Input Text Field Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputTextField() {
        function link(scope, elem, attr, ctrl) {
            var config = scope.config;

            if (!config) {
                return;
            }

            var dir = {
                state: {
                    hover: false,
                    focus: false
                }
            };

            dir.init = function () {
                dir.errorState = {};
                scope.inputText = dir;

                if (config.size) {
                    dir.state[config.size] = true;
                }

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, config.validators);
                }

                if (dir.hasAsyncValidators()) {
                    angular.extend(ctrl.$asyncValidators, config.asyncValidators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.hasValidators = function () {
                return config.validators &&
                    Object.keys(config.validators).length !== 0;
            };

            dir.hasAsyncValidators = function () {
                return config.asyncValidators &&
                    Object.keys(config.asyncValidators).length !== 0;
            };

            dir.getState = function (data) {
                angular.extend(dir.state, {
                    dirty: ctrl.$dirty,
                    error: ctrl.$invalid,
                    touched: ctrl.$touched,
                    readonly: config.readonly,
                    disabled: config.disabled
                }, dir.errorState, ctrl.$error);

                config.errorMsgs.forEach(function (msg) {
                    msg.active = ctrl.$error[msg.name];
                });

                return dir.state;
            };

            dir.onFocus = function () {
                dir.state.focus = true;
            };

            dir.onBlur = function () {
                var onBlur = config.onBlur;
                dir.state.focus = false;

                if (onBlur) {
                    if (typeof onBlur == "function") {
                        onBlur();
                    }
                    else {
                        logw("rpFormInputText: onBlur callback is not a function!");
                    }
                }
            };

            dir.onMouseover = function () {
                dir.state.hover = true;
            };

            dir.onMouseout = function () {
                dir.state.hover = false;
            };

            dir.onChange = function (data) {
                var onChange = config.onChange;

                if (onChange) {
                    if (typeof onChange == "function") {
                        onChange(data);
                    }
                    else {
                        logw("rpFormInputText: onChange callback is not a function!");
                    }
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                ctrl = undefined;
                config = undefined;
                scope.config = undefined;
                scope.inputText = undefined;
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
        .module("rpFormInputText")
        .directive("rpFormInputTextField", [rpFormInputTextField]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\directives\form-input-text.js
//  Form Input Text Directive

(function (angular, undefined) {
    "use strict";

    function rpFormInputText(baseConfig) {
        function pre(scope, elem, attr) {
            scope.config = scope.config || baseConfig({
                modelOptions: {
                    updateOn: "blur"
                }
            });

            if (scope.config.errorMsgs && !scope.config.errorMsgs.empty()) {
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
                config: "=?",
                rpModel: "="
            },
            restrict: "E",
            replace: true,
            compile: compile,
            templateUrl: "realpage/form-input-text-v1/templates/input-text.html"
        };
    }

    angular
        .module("rpFormInputText")
        .directive("rpFormInputText", ["rpFormInputTextConfig", rpFormInputText]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\directives\filter-input.js
//  Filter Input Directive

(function (angular, undefined) {
    "use strict";

    function rpFilterInput(inputFilter, filter) {
        function link(scope, elem, attr) {
            var dir = {},
                filterKey;

            dir.init = function () {
                filterKey = scope.$eval(attr.rpFilterInput);

                if (filterKey) {
                    if (filter.exists(filterKey)) {
                        elem.on("keydown.rpFilterInput", dir.onKeyDown);
                    }
                    else {
                        logc("rpFilterInput.init: " + filterKey + " is not a valid input filter");
                    }
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onKeyDown = function (event) {
                return inputFilter[filterKey](event);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.off("keydown.rpFilterInput");

                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
                filterKey = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpFormInputText")
        .directive("rpFilterInput", ["rpInputFilter", "rpInputFilter", rpFilterInput]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\models\filter-types.js
//  Form Input Filter Types

(function (angular, undefined) {
    "use strict";

    function factory() {
        return {
            numeric: "isNumeric"
        };
    }

    angular
        .module("rpFormInputText")
        .factory("rpInputFilterType", [factory]);
})(angular);

//  Source: _lib\realpage\form-input-text-v1\js\models\form-input-text-config.js
//  Form Input Text Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var index = 0;

        return function (cfg) {
            index++;
            cfg = cfg || {};

            var fieldId = "input" + index;

            var defCfg =  {
                prefix: "",
                suffix: "",
                id: fieldId,
                iconClass: "",
                minlength: "",
                maxlength: "",
                disabled: false,
                readonly: false,
                required: false,
                dataType: "text",
                fieldName: fieldId,
                size: "",
                // pattern: /^[0-9a-z]+$/i,
                placeholder: "",
                errorMsgs: [],
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                asyncValidators: {

                },
                modelOptions: {
                    updateOn: "default"
                },
                onBlur: angular.noop,
                onChange: angular.noop,
                autocomplete: "off"
            };

            return angular.extend(defCfg, cfg);
        };
    }

    angular
        .module("rpFormInputText")
        .factory("rpFormInputTextConfig", [factory]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\services\input-filter.js
//  Form Input Filter Service

(function (angular, undefined) {
    "use strict";

    function FormInputFilter(keycode) {
        var svc = this;

        svc.isNumeric = function () {
            return keycode.isNumeric(event) || keycode.isNav(event);
        };

        svc.exists = function (key) {
            return !!svc[key];
        };
    }

    angular
        .module("rpFormInputText")
        .service("rpInputFilter", [
            "keycode",
            FormInputFilter
        ]);
})(angular);


//  Source: _lib\realpage\form-input-text-v1\js\templates\templates.inc.js
angular.module('rpFormSelectMenu').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/form-input-text-v1/templates/input-text.html",
"<div class=\"rp-form-input-text\" ng-class=\"inputText.getState()\"><div class=\"rp-form-input-text-table\"><div class=\"rp-form-input-text-row\"><div ng-if=\"config.prefix\" class=\"rp-form-input-text-cell rp-form-input-text-prefix\"><span class=\"rp-form-input-text-prefix-text\">{{::config.prefix}}</span></div><div class=\"rp-form-input-text-cell rp-form-input-text-field-wrap\"><input class=\"rp-form-input-text-field\" id=\"{{::config.id}}\" maxlength=\"{{config.maxlength}}\" minlength=\"{{config.minlength}}\" name=\"{{::config.fieldName}}\" ng-blur=\"inputText.onBlur()\" ng-change=\"inputText.onChange(rpModel)\" ng-disabled=\"config.disabled\" ng-focus=\"inputText.onFocus()\" ng-model-options=\"config.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"inputText.onMouseout()\" ng-mouseover=\"inputText.onMouseover()\" ng-pattern=\"config.pattern\" ng-readonly=\"config.readonly\" ng-required=\"config.required\" placeholder=\"{{config.placeholder}}\" rp-filter-input=\"config.inputFilter\" type=\"{{::config.dataType}}\" autocomplete=\"{{::config.autocomplete}}\"></div><div ng-if=\"config.suffix\" class=\"rp-form-input-text-cell rp-form-input-text-suffix\"><span ng-if=\"config.suffix\" class=\"rp-form-input-text-suffix-text\">{{::config.suffix}}</span></div><div ng-if=\"config.iconClass\" class=\"rp-form-input-text-cell rp-form-input-text-icon-wrap\"><span class=\"rp-form-input-text-icon {{config.iconClass}}\"></span></div></div></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in config.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

