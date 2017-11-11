//  Configure App Language Keys for Model Settings - lease options

(function(angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'viewPayHeader'
        ];

        appLangKeys.app('viewpay').set(keys);
    }

    angular
        .module("uam")
        .config(['appLangKeysProvider', config]);
})(angular);