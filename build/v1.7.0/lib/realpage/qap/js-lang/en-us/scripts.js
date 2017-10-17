//  Source: _lib\realpage\qap\js-lang\_keys\messaging\keys.js
//  Configure App Language Keys

(function (angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'myMessages',
            'messages',
            'activities',
            'messageData'
        ];

        appLangKeys.app('qap').set(keys);
    }

    angular
        .module("rpQap")
        .config(['appLangKeysProvider', config]);
})(angular);

//  Source: _lib\realpage\qap\js-lang\en-us\messaging\resource.js
//  English Resource Bundle for Logon Messages

(function (angular) {
    "use strict";

    function config(appLangBundle) {
        var bundle = appLangBundle.lang('en-us').app('qap');

        bundle.set({
            "myMessages": "My Messages",
            "messages": "Messages",
            "activities": "Activities",
            "messageData": ""
        });

        bundle.test();
    }

    angular
        .module("rpQap")
        .config(['appLangBundleProvider', config]);
})(angular);

