//  Configure App Language Keys for Model Settings - lease options

(function(angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'accountsHeader',
            'comingsoon'
        ];

        appLangKeys.app('Accounts').set(keys);
    }

    angular
        .module("ui")
        .config(['appLangKeysProvider', config]);
})(angular);