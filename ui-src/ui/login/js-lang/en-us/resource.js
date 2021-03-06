//  English Resource Bundle for Model Settings - Lease Options

(function(angular) {
    "use strict";

    function config(appLangBundle) {

        var values = {
            'loginHeader': 'Welcome to AMA Plaza',
            'TenantPortal': 'Tenant Portal',
            'Logoplaceholder': 'Logo placeholder',
            'comapnyAddr': '444 N Wabash Ave,Chicago IL 60611',
            'Managedby': 'Managed by',
            'uName': 'Username',
            'pwd': 'Password',
            'Rememberme': 'Remember me',
            'ForgotPwd': 'Forgot Password?',
            'username-email': 'Your username is normally your company email address or an alternative specified by your system administrator',
            'Enter-username-email': 'Enter your username or email',
            's1': 'Step one',
            's2': 'Step two',
            's3': 'Step three',
            'how-reset-pwd': 'How would you like to reset your password',
            'email-me': 'Please enter Authorization code',
            'to-number': 'Text me a verification code to number on file',
            'answer': 'Answer the following to verify this account is yours',
            'verifyCode': 'Enter Verification Code',
            'txt-msg': 'A text message was sent to',
            'random-qusns': 'Answer the Security questions below to verify the account is yours and reset your password',
            'q-1': "What was your first pet's name?",
            'enter_pwd1': 'Enter a new password for',
            'enter_pwd2': '.Passwords must have atleast :',
            'r1': '8 characters',
            'r2': '1 upper-case letter',
            'r3': '1 lower-case letter',
            'r4': '1 number',
            'r5': '1 special character (?!#%)',
            'pwd-match-restrict': 'The passwords you typed do not match. Please try again',
            'successAlert': 'You have successfully changed your password',
            'pls-login': 'Please login now.',
            'returnToLogin': 'Return to login screen',
            'failureAlert': 'You have entered an invalid username and/or password. Please check your credentials',
            'warningAlert': 'You have one more attempt to enter a valid username and password before your account will be locked.',
            'accountLocked': 'Your account has been locked for 30 minutes.',
            'lockedAlert': 'If you have forgotten your username or password click the forgot password link below once your account has been unlocked',
            'RsndCode': 'Resend Code'
        };

        appLangBundle.lang('en-us').app('login').set(values);
    }

    angular
        .module("ui")
        .config(['appLangBundleProvider', config]);
})(angular);