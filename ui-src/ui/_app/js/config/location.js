// Location Service Config

(function (angular) {
    "use strict";

    function config($locationProvider) {
        $locationProvider.hashPrefix("");
    }

    angular
        .module("uam")
        .config(["$locationProvider", config]);
})(angular);
