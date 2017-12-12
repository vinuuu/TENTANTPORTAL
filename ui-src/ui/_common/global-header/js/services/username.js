//  Header Username

(function(angular, undefined) {
    "use strict";

    function GlobalHeaderUsername(headerModel) {
        var svc = this;

        svc.nameWatch = angular.noop;
        svc.setUsername = function(name) {
            headerModel.extendData({
                username: name
            });
        };
    }

    angular
        .module("ui")
        .service("globalHeaderUsername", [
            "rpGlobalHeaderModel",
            GlobalHeaderUsername
        ]);
})(angular);