//  Source: _lib\realpage\form-select-menu\js\_bundle.inc
angular.module("rpFormSelectMenu", []);

//  Source: _lib\realpage\form-select-menu\js\services\select-menu.js
//  Select Menu Model Service

(function (angular) {
    "use strict";

    function rpSelectMenuModel(eventStream) {
        return function () {
            var model,
                names = [],
                events = {},
                values = [],
                valKey = 'value',
                nameKey = 'name';

            events.change = eventStream();

            function init() {
                model.events = events;
                model.valKey = valKey;
                model.nameKey = nameKey;
                events.change.subscribe(model.updateValue);
            }

            model = {
                options: [],
                selected: '',
                labelText: '',
                updateLabel: true
            };

            model.setNameKey = function (key) {
                nameKey = model.nameKey = key;
                return model;
            };

            model.setValKey = function (key) {
                valKey = model.valKey = key;
                return model;
            };

            model.reset = function () {
                model.resetValue().resetState();
                model.selected = model.options[0];
            };

            model.resetState = function () {
                for (var key in model.state) {
                    model.state[key] = false;
                }
            };

            model.isValidOption = function (newOption) {
                return newOption[nameKey] !== undefined && newOption[valKey] !== undefined;
            };

            model.isDuplicateOption = function (newOption) {
                var duplicateName = names.contains(newOption[nameKey]),
                    duplicateValue = values.contains(newOption[valKey]);

                return duplicateName || duplicateValue;
            };

            model.setOptions = function (options) {
                if (options && options.forEach) {
                    options.forEach(model.addOption);
                }
                return model;
            };

            model.addOption = function (newOption) {
                var count = 0,
                    isValid = model.isValidOption(newOption) && !model.isDuplicateOption(newOption);

                if (isValid) {
                    model.options.push(newOption);
                    names.push(newOption[nameKey]);
                    values.push(newOption[valKey]);

                    if (model.options.length == 1) {
                        model.selected = model.options[0];
                    }
                }

                return model;
            };

            model.removeOption = function (option) {
                var index = names.indexOf(option[nameKey]);

                if (index != -1) {
                    names.remove(index);
                    values.remove(index);
                    model.options.remove(index);

                    if (index === 0) {
                        model.selected = model.options[0];
                    }
                }

                return model;
            };

            model.flushOptions = function () {
                names.flush();
                values.flush();
                model.selected = '';
                model.options.flush();
                return model;
            };

            model.selectOption = function (option) {
                var index,
                    nameIndex = names.indexOf(option[nameKey]),
                    valueIndex = values.indexOf(option[valKey]);

                if (nameIndex != -1) {
                    model.selected = model.options[nameIndex];
                }
                else if (valueIndex != -1) {
                    model.selected = model.options[valueIndex];
                }
                else {
                    logc('rpSelectMenuModel: ', option, ' is not a valid option');
                }

                return model;
            };

            model.selectOptionIndex = function (optionIndex) {
                if (optionIndex < model.options.length && optionIndex > -1) {
                    model.selected = model.options[optionIndex];
                }
                return model;
            };

            model.resetValue = function () {
                if (model.form && model.formKey) {
                    model.form[model.formKey] = '';
                }
                return model;
            };

            model.updateValue = function (selected) {
                if (model.form && model.formKey) {
                    logc('setting value...', selected);
                    model.form[model.formKey] = selected[valKey];
                }
            };

            model.destroy = function () {
                var s = this;
                s = null;
                names = null;
                values = null;
            };

            init();

            return model;
        };
    }

    angular
        .module('rpFormSelectMenu')
        .factory('rpSelectMenuModel', ['eventStream', rpSelectMenuModel]);
})(angular);

//  Source: _lib\realpage\form-select-menu\js\services\select-menu-html.js
//  Select Menu Html Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.wrap = function () {
            var html = "<div class='rp-select-menu'></div>";
            return angular.element(html);
        };

        svc.inner = function (instName) {
            var html = "" +

            "<div class='rp-select-menu-inner' ng-class='" + instName + ".getState()'>" +
                "<span class='rp-select-menu-value'>" +
                    "{{" + instName + ".getDisplayText()}}" +
                "</span>" +
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

        return svc;
    }

    angular
        .module('rpFormSelectMenu')
        .factory('rpSelectMenuHtml', [factory]);
})(angular);

//  Source: _lib\realpage\form-select-menu\js\directives\select-menu.js
//  Select Menu Directive

(function (angular, und) {
    "use strict";

    function rpFormSelect($parse, $compile, html) {
        var index = 0;

        function link(scope, elem, attr, ctrl) {
            index++;

            var outer,
                defVal,
                defName,
                nameKey,
                valueKey,
                dir = {},
                instName,
                state = {},
                blur = 'blur.rpFormSelect' + index,
                focus = 'focus.rpFormSelect' + index;

            function init() {
                dir.state = state;
                nameKey = attr.rpOptionNameKey || 'name';
                dir.errorMsg = scope.$eval(attr.rpErrorMsg);
                valueKey = attr.rpOptionValueKey || 'value';
                dir.exposeInstance().decorate().bindEvents().storeData();
            }

            //  Startup

            dir.setInstanceName = function () {
                instName = attr.rpInstanceName ? attr.rpInstanceName : 'rpFormSelect' + index;
                return dir;
            };

            dir.exposeInstance = function () {
                dir.setInstanceName();
                scope[instName] = dir;
                return dir;
            };

            dir.decorate = function () {
                var wrap = html.wrap(),
                    inner = html.inner(instName);

                if (attr.rpWrapperClass) {
                    wrap.addClass(attr.rpWrapperClass);
                }

                $compile(wrap)(scope);
                $compile(inner)(scope);

                outer = elem.wrap(wrap).parent().append(inner);

                return dir;
            };

            dir.bindEvents = function () {
                elem.on(focus, dir.onFocus);
                return dir;
            };

            dir.storeData = function () {
                defVal = dir.getValue();
                defName = dir.getSelectedName();
                return dir;
            };

            //  State Management

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

            dir.reset = function () {
                var fn = $parse(attr.ngModel);
                scope.$apply(function () {
                    dir.state = state = {};
                    fn.assign(scope, defVal);
                });
            };

            //  Getters

            dir.getOptions = function () {
                return scope.$eval(attr.rpSelectOptions);
            };

            dir.getValue = function () {
                return scope.$eval(attr.ngModel);
            };

            dir.getState = function () {
                if (ctrl) {
                    angular.extend(state, {
                        error: ctrl.$invalid,
                        touched: ctrl.$touched,
                        required: ctrl.$required
                    });
                }

                return state;
            };

            dir.getDisplayText = function () {
                if (scope.$eval(attr.rpUpdateDisplayText)) {
                    return dir.getSelectedName();
                }
                else {
                    return defName;
                }
            };

            dir.getSelectedName = function () {
                var name,
                    val = dir.getValue(),
                    options = dir.getOptions().options;

                val = val === und ? "" : val;

                options.forEach(function (option) {
                    if (val === option[valueKey]) {
                        name = option[nameKey];
                    }
                });

                return name;
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
        .module('rpFormSelectMenu')
        .directive('rpFormSelect', [
            '$parse',
            '$compile',
            'rpSelectMenuHtml',
            rpFormSelect
        ]);
})(angular);

