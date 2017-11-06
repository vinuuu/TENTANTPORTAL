//  Source: _lib\realpage\global-header-lang\js\config\global-header.js
//  App Switcher Tabs Data

(function (angular) {
    "use strict";

    function config($timeout, model) {
        $timeout(model.translate.bind(model), 200);
    }

    angular
        .module("rpGlobalHeader")
        .run(["$timeout", "rpGlobalHeaderModel", config]);
})(angular);

