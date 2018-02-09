//  Configure Routes

(function(angular) {
    "use strict";

    function config(RoutesProvider) {
        var routes = {};
        routes["login"] = {
            url: "/",
            rerun: true,
            controller: "loginCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.base",
                    "ui.login",
                    "lib.realpage.form-input-radio"
                ]
            }]
        };
        routes["home"] = {
            url: "",
            abstract: true,
            controller: "HomeCtrl as page",
            lazyLoad: [{
                files: [
                    "lib.realpage.global-header-lang",
                    "ui.home.base",
                    "lib.realpage.common",
                    "lib.realpage.float-scroll",
                    "lib.realpage.form-common",
                    "lib.realpage.datetimepicker-v1",
                    "lib.realpage.form-input-text-v1",
                    "lib.realpage.scrolling-tabs-menu",
                    "lib.realpage.pagination",
                    "lib.realpage.grid-controls",
                ]
            }]
        };
        routes["home.dashbaord"] = {
            url: "/dashbaord",
            controller: "dashboardCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.account-payments",
                    //"lib.realpage.accordion",
                    //"lib.angular.slider",
                ]
            }]
        };
        routes["home.account-payments"] = {
            url: "/accounts/lease/:id",
            controller: "accountsCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.invoice",
                    "ui.home.account-payments"                   
                ]
            }]
        };
        routes["home.view-statements"] = {
            url: "/statements/lease/:id/month/:m",
            controller: "statementsCtrl as page",
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.view-statements",

                ]
            }]
        };
        routes["home.invoice"] = {
            url: "/invoice/lease/:id/month/:m",
            controller: "invoiceCtrl as page",
            rerun: true,
            lazyLoad: [{
                files: [
                    "ui.home.dashbaord",
                    "ui.home.invoice",
                ]
            }]
        };
        routes["home.settings"]={
            url: "/settings",
            controller: "SettingsCtrl as page",
            lazyLoad: [{
                rerun: true,
                files: [
                    "ui.home.settings",
                ]
            }]
        };
        routes["home.error"] = {
            url: "/error/:errorCode",
            controller: "ErrorCtrl as page",
            params: {
                errorCode: '404',
                templateUrl: undefined,
                model: undefined
            },
            lazyLoad: [{
                serie: true,
                rerun: true,
                files: [
                    "ui.home.error"
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
                    "ui.home.floorplan-unit.bundle"
                ]
            }]
        };

        routes["home.common-area"] = {
            url: "/common-area",
            controller: "CommonAreaCtrl as commonArea",
            lazyLoad: [{
                files: [
                    "ui.home.common-area"
                ]
            }]
        };

        routes["home.activity"] = {
            url: "/activity",
            controller: "ActivityCtrl as activity",
            lazyLoad: [{
                files: [
                    "ui.home.activity"
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
                    "ui.home.profile-settings.bundle"
                ]
            }]
        };

        RoutesProvider
            .setTemplateUrlPrefix("ui/")
            .setRoutes(routes)
            .setDefault("/");
    }

    angular
        .module("ui")
        .config(["rpRoutesProvider", config]);
})(angular);