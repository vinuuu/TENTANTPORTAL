//  Source: _lib\realpage\form-input-radio\js\_bundle.inc
angular.module("rpInputRadio", []);

//  Source: _lib\realpage\form-input-radio\js\services\radio.js
//  Radio Button Service

(function (angular, und) {
    "use strict";

    function factory() {
        var svc = {},
            radios = {};

        svc.register = function (groupName, id, radio) {
            radios[groupName] = radios[groupName] || {};
            radios[groupName][id] = radios[groupName][id] || radio;
        };

        svc.check = function (groupName, id) {
            var group = radios[groupName];
            for (var key in group) {
                var radio = group[key];
                radio[key == id ? 'check' : 'uncheck']();
            }
        };

        svc.checkRadio = function (groupName, id) {
            var group = radios[groupName];
            for (var key in group) {
                var radio = group[key];
                radio[key == id ? 'checkRadio' : 'uncheckRadio']();
            }
        };

        svc.destroy = function (groupName, id) {
            var radioExists = groupName && id;
            radioExists = radioExists && radios[groupName];
            radioExists = radioExists && radios[groupName][id];

            if (radioExists) {
                delete radios[groupName][id];
            }
        };

        return svc;
    }

    angular
        .module('rpFormInputRadio')
        .factory('rpRadioSvc', [factory]);
})(angular);

//  Source: _lib\realpage\form-input-radio\js\services\input-radio-html.js
//  Input Radio Html Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.wrap = function () {
            var html = "<div class='rp-input-radio'></div>";
            return angular.element(html);
        };

        svc.inner = function (instName) {
            var html = "" +

            "<div class='rp-input-radio-inner' ng-class='" + instName + ".getState()'>" +
            "</div>";

            return angular.element(html);
        };

        return svc;
    }

    angular
        .module('rpFormInputRadio')
        .factory('rpInputRadioHtml', [factory]);
})(angular);

//  Source: _lib\realpage\form-input-radio\js\directives\input-radio.js
//  Input Radio Directive

(function (angular, und) {
    "use strict";

    function rpFormRadio($compile, $parse, radioSvc, html) {
        var index = 0;

        function link(scope, elem, attr, ctrl) {
            index++;

            var wrap,
                inner,
                model,
                dir = {},
                instName,
                state = {},
                radioId = 'radio' + index,
                blur = 'blur.rpFormRadio' + index,
                click = 'click.rpFormRadio' + index,
                focus = 'focus.rpFormRadio' + index,
                change = 'change.rpFormRadio' + index;

            function init() {
                dir.exposeInstance().register().decorate().bindEvents();
            }

            dir.setInstanceName = function () {
                instName = attr.rpInstanceName ? attr.rpInstanceName : 'rpFormRadio' + index;
            };

            dir.exposeInstance = function () {
                dir.setInstanceName();
                scope[instName] = dir;
                return dir;
            };

            dir.register = function () {
                radioSvc.register(attr.ngModel, radioId, dir);
                return dir;
            };

            dir.decorate = function () {
                wrap = html.wrap(instName);
                inner = html.inner(instName);

                if (attr.rpWrapperClass) {
                    wrap.addClass(attr.rpWrapperClass);
                }

                $compile(inner)(scope);

                elem.wrap(wrap).parent().append(inner);

                return dir;
            };

            dir.bindEvents = function () {
                elem.on(focus, dir.onFocus);
                elem.on(change, dir.onChange);
                inner.on(click, dir.updateValue);
                scope.$on('$destroy', dir.destroy);
                return dir;
            };

            dir.updateValue = function () {
                if (dir.isDisabled()) {
                    return;
                }

                scope.$apply(function () {
                    radioSvc.check(attr.ngModel, radioId);
                    radioSvc.checkRadio(attr.ngModel, radioId);
                });
            };

            dir.isDisabled = function () {
                return scope.$eval(attr.ngDisabled) === true;
            };

            // State Management

            dir.checkRadio = function () {
                elem.prop('checked', true).click();
            };

            dir.uncheckRadio = function () {
                elem.prop('checked', false);
            };

            dir.check = function () {
                state.checked = true;
            };

            dir.uncheck = function () {
                state.checked = false;
            };

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

            dir.onChange = function () {
                scope.$apply(function () {
                    radioSvc.check(attr.ngModel, radioId);
                });
            };

            //  Getters

            dir.getRadioValue = function () {
                var val;

                if (attr.value) {
                    val = attr.value;
                }

                if (attr.ngValue) {
                    val = scope.$eval(attr.ngValue);
                }

                return val;
            };

            dir.getState = function () {
                if (ctrl) {
                    angular.extend(state, {
                        error: ctrl.$error,
                        touched: ctrl.$touched,
                        required: ctrl.required,
                        checked: ctrl.$modelValue == dir.getRadioValue()
                    });
                }

                return state;
            };

            dir.destroy = function () {
                radioSvc.destroy(model);
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
        .module('rpFormInputRadio')
        .directive('rpFormRadio', ['$compile', '$parse', 'rpRadioSvc', 'rpInputRadioHtml', rpFormRadio]);
})(angular);

