//  Lazy Load Config

(function(angular) {
    "use strict";

    function config(resolveModule) {
        var modules, appConfig,
            appName = "ui";

        modules = {
            "home.base": ["css", "js"],
            "home.dashbaord": ["css", "js"],
            "home.account-payments": ["css", "js", "lang"],
            "home.view-statements": ["css", "js"],
            "home.viewing-paying": ["css", "js", "lang"],
            "login": ["css", "js", "lang"],
            "home.common-area": ["css", "js"],
            "home.activity": ["css", "js"],
            "home.floorplan-unit.bundle": ["css", "js"],
            "home.profile-settings.bundle": ["css", "js"],
            "Common.primary-nav": ["css", "js"]
        };

        appConfig = {
            appName: appName,
            modules: modules,
            basePath: "/ui"
        };

        resolveModule
            .setLazyLoad(appName, appConfig);
    }

    angular
        .module("ui")
        .config(["rpResolveModuleProvider", config]);
})(angular);