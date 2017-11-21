// Location Service Config

(function (angular) {
    "use strict";

    function config($locationProvider) {
        $locationProvider.hashPrefix("");
    }

    angular
        .module("ui")
        .config(["$locationProvider", config]);
})(angular);
