// Google Analytics

(function (angular) {
    "use strict";

    function setConfig(ga) {
        ga.init("UA-45547414-4");
    }

    angular
        .module("uam")
        .run(["googleAnalytics", setConfig]);
})(angular);
