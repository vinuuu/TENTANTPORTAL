//  Configure App Language Keys for Model Settings - lease options

(function (angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'lbl_404_statusCode',
            'lbl_404_title',
            'lbl_404_message',
            'lbl_500_statusCode',
            'lbl_500_title',
            'lbl_500_message',
            'lbl_401_statusCode',
            'lbl_401_title',
            'lbl_401_message',
            'lbl_back_btn_text',
        ];

        appLangKeys.app('error').set(keys);
    }

    angular
        .module("budgeting")
        .config(['appLangKeysProvider', config]);
})(angular);
