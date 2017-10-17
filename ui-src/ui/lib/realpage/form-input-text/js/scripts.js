//  Source: _lib\realpage\form-input-text\js\_bundle.inc
angular.module("rpInputText", []);

//  Source: _lib\realpage\form-input-text\js\directives\input-text.js
//  Input Text Directive

(function (angular, und) {
    "use strict";

    function rpFormInput($compile, html) {
        var index = 1;

        function link(scope, elem, attr, ctrl) {
            var dir = {},
                instName,
                state = {},
                wrap, icon, inner, outer,
                blur = 'blur.rpFormInput',
                focus = 'focus.rpFormInput',
                mouseout = 'mouseout.rpFormInput',
                mouseover = 'mouseover.rpFormInput';

            function init() {
                dir.state = state;
                dir.errorMsgs = [];
                dir.errorKeys = [];
                dir.setErrorMessages().exposeInstance().decorate().bindEvents();
            }

            //  Startup

            dir.setErrorMessages = function () {
                var errorMsgs = scope.$eval(attr.rpErrorMsg);

                for (var key in errorMsgs) {
                    var error = {
                        key: key,
                        msg: errorMsgs[key]
                    };

                    dir.errorKeys.push(key);
                    dir.errorMsgs.push(error);
                }

                return dir;
            };

            dir.setInstanceName = function () {
                instName = attr.rpInstanceName || 'rpFormInput' + index++;
                return dir;
            };

            dir.exposeInstance = function () {
                dir.setInstanceName();
                scope[instName] = dir;
                return dir;
            };

            dir.decorate = function () {
                wrap = html.wrap();
                icon = html.icon(instName);
                inner = html.inner(instName);

                if (attr.rpWrapperClass) {
                    wrap.addClass(attr.rpWrapperClass);
                }

                $compile(icon)(scope);
                $compile(inner)(scope);

                outer = elem.wrap(wrap).parent().append(inner, icon);

                return dir;
            };

            dir.bindEvents = function () {
                elem.on(focus, dir.onFocus);
                elem.on(mouseover, dir.onMouseover);
                return dir;
            };

            dir.isDisabled = function () {
                return scope.$eval(attr.ngDisabled) === true;
            };

            //  State Management

            dir.onMouseover = function () {
                scope.$apply(function () {
                    state.hover = true;
                    elem.on(mouseout, dir.onMouseout);
                });
            };

            dir.onMouseout = function () {
                scope.$apply(function () {
                    elem.off(mouseout);
                    state.hover = false;
                });
            };

            dir.onFocus = function () {
                scope.$apply(function () {
                    state.focus = true;
                    outer.addClass('focus');
                    elem.on(blur, dir.onBlur);
                });
            };

            dir.onBlur = function () {
                scope.$apply(function () {
                    elem.off(blur);
                    state.focus = false;
                    outer.removeClass('focus');
                    if (!state.touched) {
                        state.touched = true;
                    }
                });
            };

            //  Getters

            dir.getState = function () {
                state.disabled = dir.isDisabled();

                if (ctrl) {
                    angular.extend(state, {
                        dirty: ctrl.$dirty,
                        error: ctrl.$invalid,
                        touched: ctrl.$touched
                    });

                    dir.errorKeys.forEach(function (key) {
                        state[key] = ctrl.$error[key.camelize()];
                    });
                }

                return state;
            };

            init();
        }

        return {
            link: link,
            restrict: 'C',
            require: 'ngModel'
        };
    }

    angular
        .module('rpFormInputText')
        .directive('rpFormInput', [
            '$compile',
            'rpFormInputHtml',
            rpFormInput
        ]);
})(angular);

//  Source: _lib\realpage\form-input-text\js\directives\add-validation.js
//  Add Custom Validation

(function (angular) {
    "use strict";

    function rpAddValidation() {
        function link(scope, elem, attr, ctrl) {
            var dir = {};

            dir.init = function () {
                var list = scope.$eval(attr.rpAddValidation);

                list.forEach(function (validation) {
                    ctrl.$validators[validation.key] = validation.method;
                });
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
    }

    angular
        .module('rpFormInputText')
        .directive('rpAddValidation', [rpAddValidation]);
})(angular);

//  Source: _lib\realpage\form-input-text\js\services\input-html.js
//  Input Html Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.wrap = function () {
            var html = "<div class='rp-input-text'></div>";
            return angular.element(html);
        };

        svc.inner = function (instName) {
            var html = "" +

            "<div class='rp-input-text-inner' ng-class='" + instName + ".getState()'>" +
                "<span ng-repeat='error in " + instName + ".errorMsgs' " +
                    "class='error-msg {{::error.key}}' >" +
                    "{{::error.msg}}" +
                "</span>" +
            "</div>";

            return angular.element(html);
        };

        svc.icon = function (instName) {
            var html = "" +

            "<div class='rp-input-icon' ng-class='" + instName + ".getState()'>" +
            "</span>";

            return angular.element(html);
        };

        return svc;
    }

    angular
        .module('rpFormInputText')
        .factory('rpFormInputHtml', [factory]);
})(angular);

