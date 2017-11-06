//  Source: _lib\realpage\page-scroll-init\js\config\page-scroll-init.js
// Bind Page Scroll Initializer

(function (angular) {
    "use strict";

    function config(pageScrollInit) {
        pageScrollInit.bind();
    }

    angular
        .module("rpPageScrollInit")
        .run(["rpPageScrollInit", config]);
})(angular);

//  Source: _lib\realpage\page-scroll-init\js\services\page-scroll-init.js
//  Page Scroll Initializer Service

(function (angular) {
    "use strict";

    function RpPageScrollInit($rootScope, $window) {
        var svc = this;

        svc.bound = false;

        svc.bind = function () {
            if (!svc.bound) {
                svc.bound = true;
                $rootScope.$on("$stateChangeSuccess", svc.resetScroll);
                $rootScope.$on("$locationChangeSuccess", svc.resetScroll);
            }
        };

        svc.resetScroll = function () {
            $window.scrollTo(0, 0);
            return svc;
        };

        svc.setScroll = function (x, y) {
            $window.scrollTo(x, y);
            return svc;
        };
    }

    angular
        .module("rpPageScrollInit")
        .service("rpPageScrollInit", [
            "$rootScope",
            "$window",
            RpPageScrollInit
        ]);
})(angular);

