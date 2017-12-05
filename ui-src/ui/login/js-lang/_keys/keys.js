//  Configure App Language Keys for Model Settings - lease options

(function(angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'loginHeader',
            'TenantPortal',
            'Logoplaceholder',
            'comapnyAddr',
            'Managedby',
            'uName',
            'pwd',
            'Rememberme',
            'ForgotPwd',
            'username-email',
            'Enter-username-email',
            's1',
            's2',
            's3',
            'how-reset-pwd',
            'email-me',
            'to-number',
            'answer',
            'verifyCode',
            'txt-msg',
            'random-qusns',
            'q-1',
            'enter_pwd1',
            'enter_pwd2',
            'r1',
            'r2',
            'r3',
            'r4',
            'r5',
            'pwd-match-restrict',
            'successAlert',
            'pls-login',
            'returnToLogin',
            'failureAlert',
            'warningAlert',
            'accountLocked',
            'lockedAlert',
            'RsndCode'
        ];

        appLangKeys.app('login').set(keys);
    }

    angular
        .module("ui")
        .config(['appLangKeysProvider', config]);
})(angular);