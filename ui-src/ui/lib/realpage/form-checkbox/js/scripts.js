//  Source: _lib\realpage\form-checkbox\js\_bundle.inc
angular.module("rpFormCheckbox", []);

//  Source: _lib\realpage\form-checkbox\js\directives\checkbox.js
//  Checkbox Directive

(function (angular, und) {
    "use strict";

    function rpFormCheckbox($parse, $compile, html) {
        var index = 0;

        function link(scope, elem, attr, ctrl) {
            index++;

            var wrap,
                inner,
                dir = {},
                instName,
                state = {},
                blur = 'blur.rpFormCheckbox' + index,
                click = 'click.rpFormCheckbox' + index,
                focus = 'focus.rpFormCheckbox' + index;

            function init() {
                dir.state = state;
                dir.exposeInstance().decorate().bindEvents();
            }

            dir.setInstanceName = function () {
                instName = attr.rpInstanceName ? attr.rpInstanceName : 'rpFormCheckbox' + index;
            };

            dir.exposeInstance = function () {
                dir.setInstanceName();
                scope[instName] = dir;
                return dir;
            };

            dir.decorate = function () {
                wrap = html.wrap(instName);
                inner = html.inner(instName);

                if (attr.rpWrapperClass) {
                    wrap.addClass(attr.rpWrapperClass);
                }

                $compile(wrap)(scope);
                $compile(inner)(scope);

                elem.wrap(wrap).parent().append(inner);

                return dir;
            };

            dir.bindEvents = function () {
                elem.on(focus, dir.onFocus);
                inner.on(click, dir.toggleValue);
                return dir;
            };

            dir.toggleValue = function () {
                if (dir.isDisabled()) {
                    return;
                }
                var reqd = attr.required,
                    fn = $parse(attr.ngModel),
                    tVal = dir.getTrueValue(),
                    change = $parse(attr.ngChange),
                    fVal = !reqd ? dir.getFalseValue() : und,
                    nVal = ctrl.$modelValue == tVal ? fVal : tVal;

                if (!state.focus) {
                    elem.trigger(focus);
                }

                scope.$apply(function () {
                    fn.assign(scope, nVal);
                    change(scope);
                });
            };

            dir.isDisabled = function () {
                return scope.$eval(attr.ngDisabled) === true;
            };

            //  State Management

            dir.onFocus = function () {
                scope.$apply(function () {
                    state.focus = true;
                    wrap.addClass('focus');
                    elem.on(blur, dir.onBlur);
                });
            };

            dir.onBlur = function () {
                scope.$apply(function () {
                    elem.off(blur);
                    state.focus = false;
                    wrap.removeClass('focus');
                });
            };

            //  Getters

            dir.getTrueValue = function () {
                var tVal = scope.$eval(attr.ngTrueValue);
                return tVal !== und ? tVal : true;
            };

            dir.getFalseValue = function () {
                var fVal = scope.$eval(attr.ngFalseValue);
                return fVal !== und ? fVal : false;
            };

            dir.getState = function () {
                state.disabled = dir.isDisabled();

                if (ctrl) {
                    angular.extend(state, {
                        error: ctrl.$invalid,
                        touched: ctrl.$touched,
                        required: ctrl.$required,
                        checked: ctrl.$modelValue === dir.getTrueValue()
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
        .module('rpFormCheckbox')
        .directive('rpFormCheckbox', ['$parse', '$compile', 'rpFormCheckboxHtml', rpFormCheckbox]);
})(angular);

//  Source: _lib\realpage\form-checkbox\js\services\checkbox.js
//  Checkbox Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.wrap = function(){
            var html = "<div class='rp-checkbox'></div>";
            return angular.element(html);
        };

        svc.inner = function (instName) {
            var html = "" +

            "<div class='rp-checkbox-inner' ng-class='" + instName + ".getState()'>" +
            "</div>";

            return angular.element(html);
        };

        return svc;
    }

    angular
        .module('rpFormCheckbox')
        .factory('rpFormCheckboxHtml', [factory]);
})(angular);

