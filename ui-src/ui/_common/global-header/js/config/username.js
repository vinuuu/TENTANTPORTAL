//  Init Username

(function(angular) {
    "use strict";

    function config(headerUsername) {}

    angular
        .module("ui")
        .run(["globalHeaderUsername", config]);
})(angular);