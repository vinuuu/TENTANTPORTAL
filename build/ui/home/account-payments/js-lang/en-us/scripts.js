//  Source: ui\home\account-payments\js-lang\_keys\keys.js
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
        .module("uam")
        .config(['appLangKeysProvider', config]);
})(angular);

//  Source: ui\home\account-payments\js-lang\en-us\resource.js
//  English Resource Bundle for Model Settings - Lease Options

(function(angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'accountsHeader': 'Accounts and Payments',
            'comingsoon': 'Coming soon',
        };

        appLangBundle.lang('en-us').app('Accounts').set(values);
    }

    angular
        .module("uam")
        .config(['appLangBundleProvider', config]);
})(angular);

