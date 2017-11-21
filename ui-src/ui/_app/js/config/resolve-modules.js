//  Config Resolve Module

(function (angular) {
    "use strict";

    function config(resolveModule) {
        var resolve = {};

        resolveModule.setResolve(resolve);
    }

    angular
        .module("ui")
        .config(["rpResolveModuleProvider", config]);
})(angular);
