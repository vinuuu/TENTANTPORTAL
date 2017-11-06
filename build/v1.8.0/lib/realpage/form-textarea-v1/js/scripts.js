//  Source: _lib\realpage\form-textarea-v1\js\_bundle.inc
angular.module("rpFormTextarea", []);

//  Source: _lib\realpage\form-textarea-v1\js\templates\templates.inc.js
angular.module("rpFormTextarea").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/form-textarea-v1/templates/textarea.html",
"<div class=\"rp-form-textarea\" ng-class=\"textarea.getState()\"><div class=\"rp-form-textarea-field-wrap\"><span class=\"rp-form-textarea-disabled\" ng-if=\"config.disabled\"></span><textarea class=\"rp-form-textarea-field\" id=\"{{::config.id}}\" maxlength=\"{{config.maxlength}}\" minlength=\"{{config.minlength}}\" name=\"{{::config.fieldName}}\" ng-blur=\"textarea.onBlur()\" ng-change=\"textarea.onChange(rpModel)\" ng-disabled=\"config.disabled\" ng-focus=\"textarea.onFocus()\" ng-model-options=\"config.modelOptions\" ng-model=\"rpModel\" ng-mouseout=\"textarea.onMouseout()\" ng-mouseover=\"textarea.onMouseover()\" ng-pattern=\"config.pattern\" ng-readonly=\"config.readonly\" ng-required=\"config.required\" placeholder=\"{{config.placeholder}}\">\n" +
"        </textarea></div><ul class=\"rp-form-error-msgs\"><li ng-if=\"msg.active\" class=\"rp-form-error-msg\" ng-repeat=\"msg in config.errorMsgs\">{{msg.text}}</li></ul></div>");
}]);

//  Source: _lib\realpage\form-textarea-v1\js\models\form-textarea-config.js
//  Form Textarea Model

(function (angular) {
    "use strict";

    function factory() {
        var index = 0;

        return function (cfg) {
            index++;

            cfg = cfg || {};

            var fieldId = "textarea" + index;

            var defCfg = {
                id: fieldId,
                minlength: "",
                maxlength: "",
                disabled: false,
                readonly: false,
                required: false,
                fieldName: fieldId,
                // pattern: /^[0-9a-z]+$/i,
                placeholder: "",
                errorMsgs: [],
                validators: {
                    // sample: function (modelValue, viewValue) {
                    //     return true/false;
                    // }
                },
                modelOptions: {
                    // updateOn: "blur"
                },
                onChange: angular.noop
            };

            return angular.extend(defCfg, cfg);
        };
    }

    angular
        .module("rpFormTextarea")
        .factory("rpFormTextareaConfig", [factory]);
})(angular);

//  Source: _lib\realpage\form-textarea-v1\js\directives\form-textarea.js
//  Form Textarea Directive

(function (angular) {
    "use strict";

    function rpFormTextarea(baseConfig) {
        function link(scope, elem, attr) {
            scope.config = scope.config || {};
            var config = angular.extend({}, scope.config);
            angular.extend(scope.config || {}, baseConfig(), config);
        }

        return {
            scope: {
                config: "=",
                rpModel: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/form-textarea-v1/templates/textarea.html"
        };
    }

    angular
        .module("rpFormTextarea")
        .directive("rpFormTextarea", ["rpFormTextareaConfig", rpFormTextarea]);
})(angular);

//  Source: _lib\realpage\form-textarea-v1\js\directives\form-textarea-field.js
//  Form Textarea Directive

(function (angular) {
    "use strict";

    function rpFormTextareaField() {
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
                dir.timer = "";
                dir.errorState = {};
                scope.textarea = dir;

                if (dir.hasValidators()) {
                    angular.extend(ctrl.$validators, config.validators);
                }

                Object.keys(ctrl.$validators).forEach(function (key) {
                    dir.errorState[key] = false;
                });
            };

            dir.hasValidators = function () {
                return config.validators &&
                    Object.keys(config.validators).length !== 0;
            };

            dir.getState = function () {
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
                dir.state.focus = false;
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
                        logw("rpFormTextarea: onChange callback is not a function!");
                    }
                }
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
        .module("rpFormTextarea")
        .directive("rpFormTextareaField", [rpFormTextareaField]);
})(angular);
