//  Source: _lib\realpage\scrolling-datepicker\js\_bundle.inc
angular.module("rpScrollingDatepicker", []);

//  Source: _lib\realpage\scrolling-datepicker\js\models\scrolling-datepicker.js
//  Scrolling Datepicker Model

(function (angular) {
    "use strict";

    var models = {};

    function factory(cookie, moment, watchable) {
        var today = moment();

        function getModel(name) {
            var model = {
                name: name
            };

            model.init = function () {
                model.days = [];
                model.getRefMom().initDays();

                model.events = {
                    update: watchable()
                };

                return model;
            };

            model.getRefMom = function () {
                var key = model.name + 'Date',
                    data = cookie.read(key),
                    found = data !== undefined;

                model.refMom = found ? moment(parseInt(data, 10)) : moment();

                model.actMom = model.refMom.clone();

                return model;
            };

            model.initDays = function () {

                var mom = model.refMom.clone().day(0);

                model.days.flush();

                for (var i = 0; i < 7; i++) {
                    var isToday = model.isSame(today, mom),
                        isActive = model.isSame(model.actMom, mom);

                    model.days.push({
                        isToday: isToday,
                        isActive: isActive,
                        moment: mom.clone()
                    });

                    mom.add(1, 'day');
                }

                return model;
            };

            model.prevWeek = function () {
                model.refMom.add(-1, 'week');
                model.initDays();
            };

            model.nextWeek = function () {
                model.refMom.add(1, 'week');
                model.initDays();
            };

            model.prevMonth = function () {
                model.refMom.add(-1, 'month');
                model.initDays();
            };

            model.nextMonth = function () {
                model.refMom.add(1, 'month');
                model.initDays();
            };

            model.isSame = function (m1, m2) {
                return m1.format('MM/DD/YY') == m2.format('MM/DD/YY');
            };

            model.activate = function (daySelected) {

                var key = model.name + 'Date',
                    x = daySelected.moment.format('x');

                if (daySelected.isActive) {
                    return model;
                }

                model.activeDate = x;
                model.refMom = daySelected.moment;
                model.actMom = daySelected.moment.clone();

                cookie.create(key, x, 7);

                model.days.forEach(function (day) {
                    day.isActive = model.isSame(model.actMom, day.moment);
                });

                model.publish();
            };

            model.getCurrent = function (format) {
                return model.refMom.format(format);
            };

            model.publish = function () {
                model.events.update.set(Date.now());
            };

            return model.init();
        }

        var svc = {};

        svc.get = function (name) {
            models[name] = models[name] || getModel(name);
            return models[name];
        };

        return svc;
    }

    angular
        .module("rpScrollingDatepicker")
        .factory('rpScrollingDatepickerModel', [
            'cookie',
            'moment',
            'watchable',
            factory
        ]);
})(angular);

//  Source: _lib\realpage\scrolling-datepicker\js\directives\scrolling-datepicker.js
//  Week Browser Directive

(function (angular) {
    "use strict";

    function datepicker(datepickerModel) {
        function link(scope, elem, attr) {
            if (!scope['model']) {
                scope.model = datepickerModel.get('demo');
                logc('rpScrollingDatepicker: model is undefined. Switching to demo mode.');
            }
        }

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/scrolling-datepicker/scrolling-datepicker.html"
        };
    }

    angular
        .module("rpScrollingDatepicker")
        .directive('rpScrollingDatepicker', ['rpScrollingDatepickerModel', datepicker]);
})(angular);

//  Source: _lib\realpage\scrolling-datepicker\js\templates\scrolling-datepicker.js
//  Week Browser Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/scrolling-datepicker/scrolling-datepicker.html";

    templateHtml = "" +

    "<div class='rp-scrolling-datepicker'>" +
        "<div class='header-row'>" +
            "<span ng-click='model.prevMonth()' class='browse prev'></span>" +
            "<span class='month-year'>" +
                "{{model.days[0].moment.format('MMMM')}} " +
                "{{model.days[0].moment.format('YYYY')}}" +
            "</span>" +
            "<span ng-click='model.nextMonth()' class='browse next'></span>" +
        "</div>" +
        "<div class='week-row'>" +
            "<div ng-click='model.prevWeek()' class='browse prev'></div>" +
            "<div ng-click='model.nextWeek()' class='browse next'></div>" +
            "<div class='days'>" +
                "<div class='day-cell' " +
                    "ng-repeat='day in model.days' " +
                    "ng-click='model.activate(day)' " +
                    "ng-class='{active: day.isActive, today: day.isToday}' >" +
                    "<p class='day-num'>{{day.moment.format('D')}}</p>" +
                    "<p class='day-name'>{{day.moment.format('ddd').toUpperCase()}}</p>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpScrollingDatepicker")
        .run(['$templateCache', installTemplate]);
})(angular);

