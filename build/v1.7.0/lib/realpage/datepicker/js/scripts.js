//  Source: _lib\realpage\datepicker\js\_bundle.inc
angular.module("rpDatepicker", []);

//  Source: _lib\realpage\datepicker\js\templates\datepicker.js
//  Datepicker Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/datepicker/datepicker.html";

    templateHtml = "" +
        "<div class='rp-datepicker' " +
            "ng-style='model.styles'>" +
            "<span class='close' ng-click='model.hide()'>x" +
            "</span>" +

            "<div class='header'>" +
                "<span class='prev' " +
                    "rp-stop-event='click' " +
                    "ng-click='model.prevMonth()' " +
                    "ng-class='{disabled: !model.allowPrevMonth()}'>" +
                "</span>" +
                "<span class='next' " +
                    "rp-stop-event='click' " +
                    "ng-click='model.nextMonth()' " +
                    "ng-class='{disabled: !model.allowNextMonth()}'>" +
                "</span>" +
                "<p class='month-name'>{{model.monthName()}}</p>" +
            "</div>" +

            "<div class='days-header'>" +
                "<p class='day-name'>S</p>" +
                "<p class='day-name'>M</p>" +
                "<p class='day-name'>T</p>" +
                "<p class='day-name'>W</p>" +
                "<p class='day-name'>T</p>" +
                "<p class='day-name'>F</p>" +
                "<p class='day-name'>S</p>" +
            "</div>" +

            "<div class='days'>" +
                "<div ng-repeat='day in model.days' " +
                    "class='day' " +
                    "ng-class='day.state' " +
                    "ng-click='model.select(day)'>" +
                    "{{day.text}}" +
                "</div>" +
            "</div>" +

            "<div class='footer'>" +
                "<span class='prev-year' " +
                    "rp-stop-event='click' " +
                    "ng-click='model.prevYear()' " +
                    "ng-class='{disabled: !model.allowPrevYear()}'>" +
                    "{{model.year()-1}}" +
                "</span>" +
                "<span class='next-year' " +
                    "rp-stop-event='click' " +
                    "ng-click='model.nextYear()' " +
                    "ng-class='{disabled: !model.allowNextYear()}'>" +
                    "{{model.year()+1}}" +
                "</span>" +
                "<span class='current-year'>" +
                    "{{model.year()}}" +
                "</span>" +
            "</div>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpDatepicker")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\datepicker\js\models\datepicker.js
//  Datepicker Model

(function (angular) {
    "use strict";

    function factory(moment, dateSvc, eventStream) {
        var model, _data;

        model = {
            days: [],

            size: {},

            styles: {},

            events: eventStream(),

            _data: {
                min: '',
                max: '',
                refDate: '',
                selDate: '',
                callerID: '',
                newCaller: true
            }
        };

        _data = model._data;

        model.update = function (data) {
            return model.updateData(data).build();
        };

        model.updateData = function (data) {
            _data.newCaller = _data.callerID != data.callerID;

            if (_data.newCaller) {
                model.events.publish({
                    name: 'update'
                });
            }

            angular.extend(_data, data);
            return model;
        };

        model.build = function () {
            var fmt = 'MM/DD/YYYY',
                ref = _data.refDate,
                end = dateSvc(ref).endDay(),
                start = dateSvc(ref).startDay();

            model.days.flush();

            while (!dateSvc(start).is(end)) {
                var aboveMax = _data.max && dateSvc(start).isAfter(_data.max),
                    belowMin = _data.min && dateSvc(start).isBefore(_data.min),
                    active = _data.selDate && dateSvc(start).is(_data.selDate),
                    disabled = belowMin || aboveMax;

                model.days.push({
                    moment: start.clone(),
                    text: start.format('D'),
                    state: {
                        active: active,
                        disabled: disabled,
                        today: dateSvc(start).isToday(),
                        current: dateSvc(start).isCurrentMonth(ref)
                    }
                });

                start.add(1, 'day');
            }

            return model;
        };

        model.updateStyles = function (styles) {
            angular.extend(model.styles, styles);
            return model;
        };

        model.updateSize = function (size) {
            angular.extend(model.size, size);
            return model;
        };

        model.hide = function () {
            model.styles.display = 'none';
            model.events.publish({
                name: 'hide'
            });
            return model;
        };

        model.show = function () {
            model.styles.display = 'block';
            model.events.publish({
                name: 'show'
            });
            return model;
        };

        model.isHidden = function () {
            return model.styles.display != 'block';
        };

        model.prevMonth = function () {
            _data.refDate.add(-1, 'month');
            return model.build();
        };

        model.prevYear = function () {
            _data.refDate.add(-1, 'year');
            return model.build();
        };

        model.nextMonth = function () {
            _data.refDate.add(1, 'month');
            return model.build();
        };

        model.nextYear = function () {
            _data.refDate.add(1, 'year');
            return model.build();
        };

        model.allowPrevMonth = function () {
            if (!_data.min || !_data.refDate) {
                return true;
            }

            var newDate = _data.refDate.clone().add(-1, 'month');
            return !dateSvc(newDate).isBefore(_data.min);
        };

        model.allowPrevYear = function () {
            if (!_data.min || !_data.refDate) {
                return true;
            }

            var newDate = _data.refDate.clone().add(-1, 'year');
            return !dateSvc(newDate).isBefore(_data.min);
        };

        model.allowNextMonth = function () {
            if (!_data.max || !_data.refDate) {
                return true;
            }

            var newDate = _data.refDate.clone().add(1, 'month');
            return !dateSvc(newDate).isAfter(_data.max);
        };

        model.allowNextYear = function () {
            if (!_data.max || !_data.refDate) {
                return true;
            }

            var newDate = _data.refDate.clone().add(1, 'year');
            return !dateSvc(newDate).isAfter(_data.max);
        };

        model.monthName = function () {
            return _data.refDate ? _data.refDate.format('MMMM') : '';
        };

        model.year = function () {
            return _data.refDate ? parseInt(_data.refDate.format('YYYY')) : 0;
        };

        model.select = function (day) {
            if (day.state.disabled) {
                return;
            }

            _data.selDate = day.moment.clone();

            model.days.forEach(function (item) {
                item.state.active = dateSvc(item.moment).is(day.moment);
            });

            model.events.publish({
                name: 'select',
                data: day.moment.format('x')
            });
        };

        model.prevCaller = function () {
            return _data.callerID;
        };

        return model;
    }

    angular
        .module("rpDatepicker")
        .factory('rpDatepickerModel', ['moment', 'rpDate', 'eventStream', factory]);
})(angular);

//  Source: _lib\realpage\datepicker\js\directives\datepicker.js
//  Datepicker Directive

(function (angular) {
    "use strict";

    function rpDatepicker(model) {
        function link(scope, elem, attr) {
            var body,
                dir = {};

            dir.init = function () {
                scope.model = model;
                body = angular.element('body');
                model.events.subscribe(dir.updateBinding);
                dir.updateSize();
            };

            dir.updateBinding = function (ev) {
                if (ev.name == 'hide') {
                    body.off('click.datepicker');
                }
                else if (ev.name == 'updateSize') {
                    dir.updateSize();
                }
                else {
                    body.on('click.datepicker', dir.hide);
                }

                return dir;
            };

            dir.hide = function () {
                scope.$apply(function () {
                    model.hide();
                });
            };

            dir.updateSize = function () {
                model.updateSize({
                    width: elem.outerWidth(),
                    height: elem.outerHeight()
                });

                return dir;
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/datepicker/datepicker.html"
        };
    }

    angular
        .module("rpDatepicker")
        .directive('rpDatepicker', ['rpDatepickerModel', rpDatepicker]);
})(angular);

