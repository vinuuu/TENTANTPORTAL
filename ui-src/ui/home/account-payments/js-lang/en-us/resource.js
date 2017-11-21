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
        .module("ui")
        .config(['appLangBundleProvider', config]);
})(angular);