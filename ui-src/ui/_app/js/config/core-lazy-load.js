//  Core Lazy Load Config

(function (angular) {
    "use strict";

    function config(cdnVer, coreLibLazyloadConfig) {
        coreLibLazyloadConfig.init({
            basePath: cdnVer
        });
    }

    angular
        .module("uam")
        .config(["cdnVer", "coreLibLazyloadConfigProvider", config]);
})(angular);
