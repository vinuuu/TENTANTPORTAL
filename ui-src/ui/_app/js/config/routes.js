//  Configure Routes

(function(angular) {
    "use strict";

    function config(RoutesProvider) {
        var routes = {};

        routes["home"] = {
            url: "",
            abstract: true,
            controller: "HomeCtrl as page",
            lazyLoad: [{
                files: [
                    "lib.realpage.global-header-lang",
                    "uam.home.base"
                ]
            }]
        };
        routes["home.dashbaord"] = {
            url: "/dashbaord",
            controller: "dashboardCtrl as page",
            lazyLoad: [{
                files: [
                    "uam.home.dashbaord",
                    "lib.realpage.accordion"
                ]
            }]
        };
        routes["home.account-payments"] = {
            url: "/accounts",
            controller: "accountsCtrl as page",
            lazyLoad: [{
                files: [
                    "uam.home.account-payments"
                ]
            }]
        };
        routes["home.floorplan-unit"] = {
            url: "/floorplan-unit",
            controller: "FloorPlanUnitCtrl as floorPlanUnit",
            lazyLoad: [{
                rerun: true,
                files: [
                    "lib.angular.motion",
                    "lib.bootstrap.additions",
                    "lib.angular.strap",
                    "uam.home.floorplan-unit.bundle"
                ]
            }]
        };

        routes["home.common-area"] = {
            url: "/common-area",
            controller: "CommonAreaCtrl as commonArea",
            lazyLoad: [{
                files: [
                    "uam.home.common-area"
                ]
            }]
        };

        routes["home.activity"] = {
            url: "/activity",
            controller: "ActivityCtrl as activity",
            lazyLoad: [{
                files: [
                    "uam.home.activity"
                ]
            }]
        };

        routes["home.profile-settings"] = {
            url: "/profile-settings",
            controller: "ProfileSettingsCtrl as page",
            lazyLoad: [{
                rerun: true,
                files: [
                    "lib.angular.motion",
                    "lib.bootstrap.additions",
                    "lib.angular.strap",
                    "uam.home.profile-settings.bundle"
                ]
            }]
        };

        RoutesProvider
            .setTemplateUrlPrefix("ui/")
            .setRoutes(routes)
            .setDefault("/dashbaord");
    }

    angular
        .module("uam")
        .config(["rpRoutesProvider", config]);
})(angular);