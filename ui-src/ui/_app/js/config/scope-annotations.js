//  Scope Annotation Config

(function (angular) {
    "use strict";

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

    angular
        .module("uam")
        .config(["$compileProvider", config]);
})(angular);
