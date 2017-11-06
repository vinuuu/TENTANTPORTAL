//  Source: _lib\realpage\busy-indicator\js\_bundle.inc
angular.module("rpBusyIndicator", []);

//  Source: _lib\realpage\busy-indicator\js\templates\busy-indicator.js
//  Busy Indicator Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/busy-indicator/busy-indicator.html";

    templateHtml = "" +
        "<div class='rp-busy-indicator {{model.className}} {{model.themeName}}' " +
            "ng-style='model.style' >" +
            "<p class='message-1'>" +
                "Still loading, just a moment" +
                "<dotter model='dotterModel'></dotter>" +
            "</p>" +
            "<p class='message-2'>" +
                "Sorry, we couldn’t complete your request<br/>" +
                "at this time. Please try again later.<br/>" +
                "<span class='message-2-btn btn btn-primary small' ng-click='model.retry()'>" +
                    "Try again" +
                "</span>" +
            "</p>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpBusyIndicator")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\services\busy-indicator-model.js
//  Busy Indicator Model Service

(function (angular, undefined) {
    "use strict";

    var fn = angular.noop;

    function service(eventStream) {
        return function () {
            var model,
                events = eventStream();

            model = {
                retry: fn,

                cancel: fn,

                style: {},

                isBusy: false,

                events: events,

                setThemeName: function (themeName) {
                    model.themeName = themeName;
                },

                busy: function () {
                    model.isBusy = true;
                    events.publish('busy');
                },

                error: function () {
                    events.publish('error');
                },

                off: function () {
                    model.isBusy = false;
                    events.publish('off');
                },

                destroy: function () {
                    events.destroy();
                }
            };

            model.destroy = function () {
                events.destroy();
                model.events = undefined;
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpBusyIndicator")
        .factory('rpBusyIndicatorModel', ['eventStream', service]);
})(angular);

//  Source: _lib\realpage\busy-indicator\js\directives\busy-indicator.js
//  Busy Indicator Directive

(function (angular, undefined) {
    "use strict";

    function rpBusyIndicator(cdnVer, timeout, eventStream) {
        function link(scope, elem, attr) {
            var model,
                dir = {},
                dotterModel = {
                    events: eventStream()
                };

            dir.init = function () {
                if (!scope.model) {
                    logc("rpBusyIndicator: model is undefined!");
                    return;
                }

                model = scope.model;
                scope.dotterModel = dotterModel;

                dir.setStyles();

                if (model.isBusy) {
                    dir.setState("busy");
                }

                scope.dir = dir;

                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.setStateWatch = model.events.subscribe(dir.setState);
            };

            dir.setStyles = function () {
                var ht = elem.outerHeight();
                model.style.lineHeight = ht + "px";
                return dir;
            };

            dir.setState = function (state) {
                var states = ["busy", "error", "off"];

                if (states.contains(state)) {
                    dir[state]();
                }
            };

            dir.setBg = function () {
                var bgi = "../" + cdnVer + "/lib/realpage/busy-indicator/images/default.gif";
                model.style.backgroundImage = "url('" + bgi + "')";
                return dir;
            };

            dir.removeBg = function () {
                model.style.backgroundImage = "";
                return dir;
            };

            dir.busy = function () {
                dir.setBg();
                model.className = "busy";
                timeout.cancel(dir.timer1);
                dir.timer1 = timeout(dir.showMsg, 10000);
            };

            dir.showMsg = function () {
                model.className = "busy msg";
                dotterModel.events.publish("start");
                dir.removeBg().timer2 = timeout(model.error, 50000);
            };

            dir.error = function () {
                model.cancel();
                model.className = "error";
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.publish("stop");
            };

            dir.off = function () {
                dir.removeBg();
                model.className = "";
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.publish("stop");
                return dir;
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.setStateWatch();
                timeout.cancel(dir.timer1);
                timeout.cancel(dir.timer2);
                dotterModel.events.destroy();

                dir = undefined;
                elem = undefined;
                attr = undefined;
                model = undefined;
                dotterModel = undefined;
                scope.model = undefined;
                scope.dotterModel = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "templates/realpage/busy-indicator/busy-indicator.html"
        };
    }

    angular
        .module("rpBusyIndicator")
        .directive("rpBusyIndicator", [
            "cdnVer",
            "timeout",
            "eventStream",
            rpBusyIndicator
        ]);
})(angular);

