//  Source: ui\home\invoices\js-lang\_keys\keys.js
//  Configure App Language Keys for Model Settings - lease options

(function(angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'viewPayHeader'
        ];

        appLangKeys.app('invoice').set(keys);
    }

    angular
        .module("ui")
        .config(['appLangKeysProvider', config]);
})(angular);

//  Source: ui\home\invoices\js-lang\en-us\resource.js
//  English Resource Bundle for Model Settings - Lease Options

(function(angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'viewPayHeader': 'Invoices'
        };

        appLangBundle.lang('en-us').app('invoice').set(values);
    }

    angular
        .module("ui")
        .config(['appLangBundleProvider', config]);
})(angular);

