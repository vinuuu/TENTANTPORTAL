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
                    "uam.home.account-payments",
                    "lib.realpage.form-select-menu-v1",
                    "lib.realpage.common",
                    "lib.realpage.float-scroll",
                    "lib.realpage.form-common",
                    "lib.realpage.datetimepicker-v1",
                    "lib.realpage.form-select-menu-v1",
                    "lib.realpage.scrolling-tabs-menu",
                    "lib.realpage.pagination",
                    "lib.realpage.busy-indicator",
                    "lib.realpage.grid",
                    "lib.realpage.grid-controls",
                    "lib.realpage.grid-pagination"
                ]
            }]
        };
        routes["home.view-statements"] = {
            url: "/statements",
            controller: "statementsCtrl as page",
            lazyLoad: [{
                files: [
                    "uam.home.view-statements",
                    "lib.realpage.form-select-menu-v1"

                ]
            }]
        };
        routes["home.viewing-paying"] = {
            url: "/viewpay",
            controller: "viewpayCtrl as page",
            lazyLoad: [{
                files: [
                    "uam.home.viewing-paying",
                    "lib.realpage.form-select-menu-v1"
                ]
            }]
        };
        routes["home.login"] = {
            url: "/login",
            controller: "loginCtrl as page",
            lazyLoad: [{
                files: [
                    "uam.home.login"
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