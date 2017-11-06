//  Source: _lib\realpage\notifications\js\_bundle.inc
angular.module("rpNotifications", []);

//  Source: _lib\realpage\notifications\js\templates\notifications.js
//  Notifications Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateHtml = "" +
        "<div class='rp-notifications'>" +
            "<div rp-notification " +
                "ng-repeat='nfn in model.list | limitTo: 1' " +
                "class='{{nfn.data().type}}-notification' >" +
                "<div class='content'>" +
                    "<span ng-if='nfn.showCloseBtn()' " +
                        "class='close' ng-click='dir.hide()' />" +
                    "<span class='icon' />" +
                    "<h2 ng-if='nfn.data().title' class='title'>{{nfn.data().title}}</h2>" +
                    "<p class='descr'>" +
                        "<span>{{nfn.data().descr}}</span>" +
                        "<a ng-repeat='action in nfn.data().actions' " +
                            "href='' " +
                            "class='action' " +
                            "ng-click='action.method($event)' >" +
                            "{{action.text}}" +
                        "</a>" +
                    "</p>" +
                "</div>" +
            "</div>" +
        "</div>";

    templateUrl = "templates/realpage/notifications/notifications.html";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpNotifications")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\notifications\js\models\notification.js
//  Notification Model

(function (angular) {
    "use strict";

    function factory(svc) {
        var index = 1;

        return function () {
            var model = {},
                id = 'nfn' + index++;

            model._data = {
                id: id,
                title: '',
                descr: '',
                actions: [],
                type: 'info',
                autoHideTime: 1000
            };

            model.data = function () {
                return model._data;
            };

            model.id = function () {
                return model._data.id;
            };

            model.showCloseBtn = function () {
                return model._data.autoHideTime === -1;
            };

            model.show = function () {
                svc.show(model);
                return model;
            };

            model.hide = function () {
                svc.hide(model);
                return model;
            };

            model.isActive = function () {
                return svc.isActive(model);
            };

            model.extend = function (options) {
                angular.extend(model._data, options);
                model._data.id = id;
                return model;
            };

            model.flushAll = function () {
                svc.flush();
            };

            model.autoHideTime = function () {
                return model._data.autoHideTime;
            };

            return model;
        };
    }

    angular
        .module("rpNotifications")
        .factory('rpNotificationModel', ['rpNotificationSvc', factory]);
})(angular);

//  Source: _lib\realpage\notifications\js\services\notification.js
//  Notification Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {};

        svc.list = [];

        svc.show = function (nfn) {
            svc.list.push(nfn);
        };

        svc.hide = function (nfn) {
            svc.list = svc.list.filter(function (listItem) {
                return listItem.id() !== nfn.id();
            });
        };

        svc.flush = function () {
            svc.list.flush();
        };

        svc.isActive = function (nfn) {
            var bool = false;
            svc.list.forEach(function (item) {
                if (nfn.id() === item.id()) {
                    bool = true;
                }
            });
            return bool;
        };

        return svc;
    }

    angular
        .module("rpNotifications")
        .factory('rpNotificationSvc', factory);
})(angular);

//  Source: _lib\realpage\notifications\js\directives\notification.js
//  Notification Directive

(function (angular) {
    "use strict";

    function rpNotification(timeout) {
        var showAnimTime = 300,
            hideAnimTime = 300;

        function link(scope, elem, attr) {
            var model,
                dir = {};

            dir.init = function () {
                scope.dir = dir;
                model = scope.nfn;
                timeout(dir.show);

                if (!model.showCloseBtn()) {
                    timeout(dir.hide, model.autoHideTime() + showAnimTime);
                }
            };

            dir.show = function () {
                elem.stop(true, true);

                elem.animate({
                    top: 15
                }, showAnimTime);
            };

            dir.hide = function () {
                elem.fadeOut(hideAnimTime, dir.remove);
            };

            dir.remove = function () {
                scope.$apply(model.hide);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpNotifications")
        .directive('rpNotification', ['timeout', rpNotification]);
})(angular);

//  Source: _lib\realpage\notifications\js\directives\notifications.js
//  Notifications Directive

(function (angular) {
    "use strict";

    function notifications(model) {
        function link(scope, elem, attr) {
            scope.model = model;
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/notifications/notifications.html"
        };
    }

    angular
        .module("rpNotifications")
        .directive('rpNotifications', ['rpNotificationSvc', notifications]);
})(angular);

