//  Header Username

(function (angular, undefined) {
    "use strict";

    function GlobalHeaderUsername(headerModel) {
        var svc = this;

        svc.set = function () {
            headerModel.extendData({
                username: "Demo User"
            });
        };
    }

    angular
        .module("rp-demo")
        .service("globalHeaderUsername", [
            "rpGlobalHeaderModel",
            GlobalHeaderUsername
        ]);
})(angular);
