//  Source: _lib\realpage\form-input-date\js\_bundle.inc
angular.module("rpFormInputDate", []);

//  Source: _lib\realpage\form-input-date\js\templates\input-date.js
//  Input Date Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/form/input-date/input-date.html";

    templateHtml = "" +

    "<div class='rp-input-date {{dateModel.options.displaySize}}' " +
        "ng-class='dateModel.state()'>" +
        "<span ng-show='!dateModel.display' " +
            "class='input-placeholder'>" +
            "{{dateModel.options.displayFormat}}" +
        "</span>" +
        "<input type='text' " +
            "ng-blur='dateModel.blur()' " +
            "class='input-type-date' " +
            "ng-model='dateModel.display' " +
            "ng-focus='dateModel.focus()' " +
            "ng-change='dir.updateModel()' " +
            "ng-model-options='{\"updateOn\": \"blur\"}' " +
            "maxlength='{{dateModel.options.maxLength}}' >" +
        "<span class='rp-icon-calendar' " +
            "rp-stop-event='click' " +
            "ng-click='dir.showDatepicker($event)'>" +

        "</span>" +
    "</div>";
    

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module('rpFormInputDate')
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\models\input-date.js
//  Input Date Model

(function (angular, und) {
    "use strict";

    function factory(moment, dateSvc, dateParser) {
        var index = 1;

        return function () {
            var model = {},
                parser = dateParser();

            model.id = 'inputDateModel' + index++;

            model.display = und;

            model.options = {
                maxLength: 10,
                anchorRight: false,
                displayFormat: 'MM/DD/YY'
            };

            model._state = {
                focus: false
            };

            model.state = function () {
                return angular.extend(model._state, {
                    empty: !model.display,
                });
            };

            model.updateOptions = function (options) {
                angular.extend(model.options, options || {});
            };

            model.focus = function () {
                model._state.focus = true;
                model._state.touched = true;
            };

            model.blur = function () {
                model._state.focus = false;
            };

            model.dirty = function () {
                model._state.dirty = true;
            };

            model.invalid = function () {
                model._state.invalid = true;
            };

            model.valid = function () {
                model._state.invalid = false;
            };

            model.getValue = function () {
                var data = parser.parse(model.display),
                    valid = model.display && data,
                    val = moment(data, model.options.displayFormat);

                valid = valid && val != 'Invalid date';

                if (val && model.options.min) {
                    var min = moment(model.options.min, 'x');
                    valid = valid && !dateSvc(val).isBefore(min);
                }
                if (val && model.options.max) {
                    var max = moment(model.options.max, 'x');
                    valid = valid && !dateSvc(val).isAfter(max);
                }

                return valid ? val.format('x') : 'Invalid date';
            };

            model.updateDisplay = function (val) {
                model._state.invalid = false;
                model.display = moment(val, 'x').format(model.options.displayFormat);
            };

            return model;
        };
    }

    angular
        .module('rpFormInputDate')
        .factory('rpInputDateModel', ['moment', 'rpDate', 'dateParser', factory]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\directives\input-date.js
//  Input Date Directive

(function (angular, und) {
    "use strict";

    function rpInputDate(moment, dateModelSvc, datepicker) {
        var index = 1;

        function link(scope, elem, attr) {
            var dir,
                modelWatch,
                dateModel = dateModelSvc();

            dir = {
                datepickerLink: und,
                datepickerOptions: {},
                id: 'rpInputDate' + index++
            };

            dir.init = function () {
                scope.dir = dir;
                scope.dateModel = dateModel;
                dateModel.updateOptions(scope.options);
                dir.watchModel();
            };

            dir.watchModel = function () {
                modelWatch = scope.$watch('model', dir.updateDisplay);
                return dir;
            };

            dir.updateModel = function () {
                dateModel.dirty();
                var val = dateModel.getValue();
                if (val == 'Invalid date') {
                    dateModel.invalid();
                }
                else {
                    dateModel.valid();
                    scope.model = val;
                }
            };

            dir.updateDisplay = function (val) {
                if (val && val != 'Invalid date') {
                    dateModel.updateDisplay(val);
                }
            };

            dir.datepickerData = function () {
                var min = '',
                    max = '',
                    selDate = scope.model ? moment(scope.model, 'x') : '',
                    refDate = scope.model ? moment(scope.model, 'x') : moment();

                if (scope.options) {
                    min = scope.options.min ? moment(scope.options.min, 'x') : '';
                    max = scope.options.max ? moment(scope.options.max, 'x') : '';
                }

                return {
                    min: min,
                    max: max,
                    callerID: dir.id,
                    refDate: refDate,
                    selDate: selDate
                };
            };

            dir.showDatepicker = function () {
                var styles = elem.offset(),
                    data = dir.datepickerData();

                if (datepicker.isHidden()) {
                    datepicker.show();
                }
                else if (dir.id == datepicker.prevCaller()) {
                    datepicker.hide();
                    return;
                }

                if (scope.options && scope.options.anchorRight) {
                    styles.left = styles.left + elem.outerWidth() - datepicker.size.width;
                }

                styles.top += elem.height() + 5;

                datepicker.update(data).updateStyles(styles);

                dir.datepickerLink = datepicker.events.subscribe(dir.unlinkDatepicker);
            };

            dir.unlinkDatepicker = function (ev) {
                if (['update', 'hide'].contains(ev.name)) {
                    dir.datepickerLink();
                }
                else if (ev.name == 'select') {
                    scope.model = ev.data;
                }
            };

            dir.init();
        }

        return {
            scope: {
                model: '=',
                options: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/form/input-date/input-date.html"
        };
    }

    angular
        .module('rpFormInputDate')
        .directive('rpInputDate', [
            'moment',
            'rpInputDateModel',
            'rpDatepickerModel',
            rpInputDate
        ]);
})(angular);

//  Source: _lib\realpage\form-input-date\js\directives\input-type-date.js
//  Input Type Date Directive

(function (angular) {
    "use strict";

    function inputTypeDate(keycode) {
        function link(scope, elem, attr) {
            function onKeyDown(event) {
                var result = keycode.test(event);
                return result.nav || ((result.numeric || result.slash) && !result.shift);
            }

            elem.on('keydown.inputTypeDate', onKeyDown);
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module('rpFormInputDate')
        .directive('inputTypeDate', ['keycode', inputTypeDate]);
})(angular);

