angular.module("rpSessionTimeout", []);

//  Source: _lib\realpage\session-timeout\js\config\session-timeout.js
//  Initialize Session Timeout

(function (angular) {
    "use strict";

    function config(sessionTimeout) {
        sessionTimeout.init();
    }

    angular
        .module("rpSessionTimeout")
        .run(["sessionTimeout", config]);
})(angular);

//  Source: _lib\realpage\session-timeout\js\directives\session-timeout.js
//  Session Timeout Directive

(function (angular) {
    "use strict";

    function directive(sessionTimer, sessionTimeout) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.timer = sessionTimer;
                scope.sessionTimeout = dir;
            };

            dir.extendSession = function () {
                sessionTimeout.extendSession();
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpSessionTimeout")
        .directive("rpSessionTimeoutModal", [
            "sessionTimer",
            "sessionTimeout",
            directive
        ]);
})(angular);

//  Source: _lib\realpage\session-timeout\js\services\session-timeout.js
//  Session Timeout Service

(function (angular) {
    "use strict";

    function SessionTimeout($modal, $window, $timeout, sessionInfo, sessionTimer, auth) {
        var svc = this;

        svc.ready = false;
        svc.win = angular.element($window);

        svc.init = function () {
            if (svc.ready) {
                return;
            }

            svc.modal = $modal({
                show: false,
                backdrop: "static",
                animation: "am-fade-and-slide-down",
                templateUrl: "realpage/session-timeout/templates/session-timeout.html"
            });

            svc.ready = true;
            svc.extendSession();
            sessionTimer.onEnd(svc.eraseAuth);
            sessionInfo.subscribe("update", svc.setModalTimeout);
        };

        svc.showModal = function () {
            svc.modal.show();
            sessionTimer.start(300);
        };

        svc.hideModal = function () {
            svc.modal.hide();
            sessionTimer.reset();
            return svc;
        };

        svc.extendSession = function () {
            svc.win.off("mousemove.sessionTimeout");
            auth.reauthenticate().then(auth.storeReauth);
            svc.hideModal().setModalTimeout();
        };

        svc.setModalTimeout = function () {
            $timeout.cancel(svc.timer1);
            $timeout.cancel(svc.timer2);
            svc.timer1 = $timeout(svc.showModal, auth.getExpTime() - 10000);
            svc.timer2 = $timeout(svc.watchUser, auth.getExpTime() - 20000);
        };

        svc.watchUser = function () {
            svc.win.on("mousemove.sessionTimeout", svc.extendSession);
        };

        svc.eraseAuth = function () {
            auth.erase().then(svc.signout);
        };

        svc.signout = function () {
            $window.location.href = "/ui/signin/#/";
        };
    }

    angular
        .module("rpSessionTimeout")
        .service("sessionTimeout", [
            "$modal",
            "$window",
            "$timeout",
            "sessionInfo",
            "sessionTimer",
            "authentication",
            SessionTimeout
        ]);
})(angular);

//  Source: _lib\realpage\session-timeout\js\services\session-timer.js
//  Session Timer Service

(function (angular) {
    "use strict";

    function SessionTimer($interval) {
        var svc = this;

        svc.data = {
            min: "",
            sec: ""
        };

        svc.timer = {
            min: "",
            sec: ""
        };

        svc.onEndCallback = angular.noop;

        svc.start = function (time) {
            svc.timer.sec = time % 60;
            svc.timer.min = Math.floor(time / 60);
            svc.countdown();
            svc.interval = $interval(svc.countdown, 1000);
        };

        svc.onEnd = function (callback) {
            svc.onEndCallback = callback;
        };

        svc.countdown = function () {
            svc.timer.sec--;

            var minPre = "",
                secPre = "";

            if (svc.timer.sec == -1) {
                svc.timer.sec = 59;
                svc.timer.min--;
            }

            if (svc.timer.min < 10) {
                minPre = "0";
            }

            if (svc.timer.sec < 10) {
                secPre = "0";
            }

            svc.data.min = minPre + svc.timer.min;
            svc.data.sec = secPre + svc.timer.sec;

            if (svc.timer.min === 0 && svc.timer.sec === 0) {
                svc.reset();
                svc.onEndCallback();
            }
        };

        svc.reset = function () {
            $interval.cancel(svc.interval);
        };
    }

    angular
        .module("rpSessionTimeout")
        .service("sessionTimer", ["$interval", SessionTimer]);
})(angular);

//  Source: _lib\realpage\session-timeout\js\templates\templates.inc.js
angular.module("rpSessionTimeout").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/session-timeout/templates/session-timeout.html",
"<div class=\"modal rp-session-timeout-modal am-fade-and-slide-top\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"sessionTimeout.extendSession()\">×</button><h4 class=\"modal-title\">Are You Still There?</h4></div><div class=\"modal-body\"><p>For security reasons, your session will end soon due to inactivity.</p><p>Your session will end in <strong>{{sessionTimeout.timer.data.min}} min(s) {{sessionTimeout.timer.data.sec}} sec(s)</strong>.</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-primary\" ng-click=\"sessionTimeout.extendSession()\">Extend Session</button></div></div></div></div>");
}]);

