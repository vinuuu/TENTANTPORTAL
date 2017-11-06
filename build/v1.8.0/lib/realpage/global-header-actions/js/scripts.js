//  Source: _lib\realpage\global-header-actions\js\config\header-actions.js
// Bind Header Actions

(function (angular) {
    "use strict";

    function config(headerActions) {
        headerActions.bind();
    }

    angular
        .module("rpGlobalHeader")
        .run(["rpGlobalHeaderActions", config]);
})(angular);

//  Source: _lib\realpage\global-header-actions\js\services\header-actions.js
//  Header Actions Service

(function (angular) {
    "use strict";

    function GlobalHeaderActions($window, $timeout, $rootScope, pubsub, auth) {
        var svc = this;

        svc.bound = false;

        svc.bind = function () {
            if (!svc.bound) {
                svc.bound = true;
                $timeout(svc.bindEvents, 100);
                pubsub.subscribe("signout.rpGlobalHeader", svc.signoutHandler);
            }
        };

        svc.bindEvents = function () {
            $rootScope.$on("rpAppStateChange", svc.onSignout);
        };

        svc.signoutHandler = function () {
            $rootScope.$emit("rpAppStateChange", {
                onContinue: svc.signout,
                triggerID: "GlobalHeaderActions.signout"
            });
        };

        svc.onSignout = function (event, eventData) {
            if (!event.defaultPrevented && eventData.triggerID == "GlobalHeaderActions.signout") {
                eventData.onContinue();
            }
        };

        svc.signout = function () {
            auth.erase().then(svc.signin, svc.signoutError);
        };

        svc.signin = function () {
            $rootScope.$destroy();
            $window.location.href = "/ui/signin/#/";
        };

        svc.signoutError = function () {
            logc("signout error!");
            $timeout(svc.signin, 500);
        };
    }

    angular
        .module("rpGlobalHeader")
        .service("rpGlobalHeaderActions", [
            "$window",
            "$timeout",
            "$rootScope",
            "pubsub",
            "authentication",
            GlobalHeaderActions
        ]);
})(angular);

