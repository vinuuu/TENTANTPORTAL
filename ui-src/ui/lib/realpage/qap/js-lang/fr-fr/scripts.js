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

//  Source: _lib\realpage\qap\js-lang\fr-fr\messaging\resource.js
//  English Resource Bundle for Logon Messages

(function (angular) {
    "use strict";

    function config(appLangBundle) {
        var bundle = appLangBundle.lang('fr-fr').app('qap');

        bundle.set({
            "myMessages": "Mes messages",
            "messages": "messages",
            "activities": "Activités",
            "messageData": ""
        });

        bundle.test();
    }

    angular
        .module("rpQap")
        .config(['appLangBundleProvider', config]);
})(angular);

