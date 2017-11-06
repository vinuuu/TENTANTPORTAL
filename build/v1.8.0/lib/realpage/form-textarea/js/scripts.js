//  Source: _lib\realpage\form-textarea\js\_bundle.inc
angular.module("rpFormTextarea", []);

//  Source: _lib\realpage\form-textarea\js\directives\textarea.js
//  textarea Directive

(function (angular) {
    "use strict";

    function textarea($compile, html) {
        var index = 1;

        function link(scope, elem, attr, ctrl) {
            index++;

            var outer,
                dir = {},
                instName,
                state = {},
                blur = 'blur.' + index,
                click = 'click.' + index,
                focus = 'focus.' + index,
                mouseout = 'mouseout.' + index,
                mouseover = 'mouseover.' + index;

            function init() {
                dir.state = state;
                dir.errorMsg = scope.$eval(attr.rpErrorMsg);
                dir.exposeInstance().decorate().bindEvents();
            }

            //  Startup

            dir.setInstance = function () {
                instName = attr.rpInstanceName || 'rpTextarea' + index;
            };

            dir.exposeInstance = function () {
                dir.setInstance();
                scope[instName] = dir;
                return dir;
            };

            dir.decorate = function () {
                var wrap = html.wrap(),
                    icon = html.icon(instName),
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
                        error: ctrl.$invalid,
                        touched: ctrl.$touched,
                        min: ctrl.$error.minlength,
                        max: ctrl.$error.maxlength,
                        pattern: ctrl.$error.pattern,
                        required: ctrl.$error.required
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
        .module('rpFormTextarea')
        .directive('rpTextarea', ['$compile', 'rpFormTextareaHtml', textarea]);
})(angular);

//  Source: _lib\realpage\form-textarea\js\services\textarea-html.js
//  Textarea Html Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.wrap = function () {
            var html = "<div class='rp-textarea'></div>";
            return angular.element(html);
        };

        svc.inner = function (instName) {
            var html = "" +

            "<div class='rp-textarea-inner' ng-class='" + instName + ".getState()'>" +
                "<span ng-if='" + instName + ".errorMsg.required' " +
                    "class='error-msg required'>" +
                    "{{" + instName + ".errorMsg.required}}" +
                "</span>" +
                "<span ng-if='" + instName + ".errorMsg.min' " +
                    "class='error-msg min'>" +
                    "{{" + instName + ".errorMsg.min}}" +
                "</span>" +
                "<span ng-if='" + instName + ".errorMsg.max' " +
                    "class='error-msg max'>" +
                    "{{" + instName + ".errorMsg.max}}" +
                "</span>" +
                "<span ng-if='" + instName + ".errorMsg.pattern' " +
                    "class='error-msg pattern'>" +
                    "{{" + instName + ".errorMsg.pattern}}" +
                "</span>" +
            "</div>";

            return angular.element(html);
        };

        svc.icon = function (instName) {
            var html = "" +

            "<div class='rp-textarea-icon' ng-class='" + instName + ".getState()'>" +
            "</span>";

            return angular.element(html);
        };

        return svc;
    }

    angular
        .module('rpFormTextarea')
        .factory('rpFormTextareaHtml', [factory]);
})(angular);

