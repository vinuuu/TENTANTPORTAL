//  Init Username

(function (angular) {
    "use strict";

    function config(username) {
        username.set();
    }

    angular
        .module("rp-demo")
        .run(["globalHeaderUsername", config]);
})(angular);
