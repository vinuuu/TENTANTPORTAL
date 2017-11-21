//  Core Lazy Load Config

(function (angular) {
    "use strict";

    function config(cdnVer, coreLibLazyloadConfig) {
        coreLibLazyloadConfig.init({
            basePath: cdnVer
        });
    }

    angular
        .module("ui")
        .config(["cdnVer", "coreLibLazyloadConfigProvider", config]);
})(angular);
