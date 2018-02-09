//  English Resource Bundle for Model Settings - Lease Options

(function(angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'Header': 'Settings'
        };

        appLangBundle.lang('en-us').app('Settings').set(values);
    }

    angular
        .module("ui")
        .config(['appLangBundleProvider', config]);
})(angular);