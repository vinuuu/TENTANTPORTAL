//  Source: ui\home\viewing-paying\js-lang\_keys\keys.js
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

//  Source: ui\home\viewing-paying\js-lang\en-us\resource.js
//  English Resource Bundle for Model Settings - Lease Options

(function(angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'viewPayHeader': 'Viewing and paying invoices in portal'
        };

        appLangBundle.lang('en-us').app('viewpay').set(values);
    }

    angular
        .module("uam")
        .config(['appLangBundleProvider', config]);
})(angular);

