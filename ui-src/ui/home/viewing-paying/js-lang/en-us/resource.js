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