//  English Resource Bundle for Model Settings - Lease Options

(function (angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'lbl_404_statusCode': '404',
            'lbl_404_title': 'OOPS!',
            'lbl_404_message': 'Sorry! The page you are looking for doesn\'t exist.',
            'lbl_500_statusCode': '500',
            'lbl_500_title': 'Don\'t worry, we are working on fixing this error soon.',
            'lbl_500_message': 'Thanks!',
            'lbl_401_statusCode': '401',
            'lbl_401_title': 'You’re not authorized to access this information.',
            'lbl_401_message': 'Please contact your Budget Administrator if you think there has been an error.',
            'lbl_back_btn_text': 'Go to the Home Page'
        };

        appLangBundle.lang('en-us').app('error').set(values);
    }

    angular
        .module("budgeting")
        .config(['appLangBundleProvider', config]);
})(angular);