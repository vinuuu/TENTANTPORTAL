//  Source: _lib\realpage\user-messages\js-lang\_keys\keys.js
//  Configure App Language Keys

(function (angular) {
    "use strict";

    function config(appLangKeys) {
        var keys = [
            'title',
            'actionValue',
            'actionText'
        ];

        appLangKeys.app('userMessages').set(keys);
    }

    angular
        .module("rpUserMessages")
        .config(['appLangKeysProvider', config]);
})(angular);

//  Source: _lib\realpage\user-messages\js-lang\en-us\resource.js
//  English Resource Bundle

(function (angular) {
    "use strict";

    function config(appLangBundle) {
        var bundle = appLangBundle.lang('en-us').app('userMessages');

        function getTitle(data) {
            var textData,
                msgID = 'msg' + data.msgID;

            textData = {
                'msg14': 'Product Release Schedule',
                'msg15': 'Microsoft Windows 10',
                'msg16': 'Browser Support for OneSite',
                'msg17': 'RealPage Client Portal',
                'msg4': 'Password Expiry Notice - Password Expires Soon'
            };

            return textData[msgID];
        }

        function getActionValue(data) {
            var textData,
                msgID = 'msg' + data.msgID;

            textData = {
                "msg14": "<p>With our continued efforts to provide you with the highest quality products and services, we have scheduled our first release for 2016 for February 13, 2016.  We hope you had a happy holiday and wish you the best in 2016.</p>",
                "msg15": "<p>On July 29th, Microsoft released its new operating system, Windows 10, which includes Internet Explorer (IE) 11 and a new web browser, Microsoft Edge.  With our October Release we have certified OneSite compatibility with Windows 10 using Internet Explorer 11. We expect to provide support for Microsoft Edge to match our support for Google Chrome, Firefox, and Safari with our March 2016 production release.</p>",
                "msg16": "<p>Enhancements are currently being made to OneSite to improve its current interface.  As a result, OneSite will not function properly with older versions of Internet Explorer. Internet Explorer 9 is the oldest version that fully supports OneSite, but we highly recommend using Internet Explorer 10 or above to experience all the functionality of the product. For additional information on the OneSite upgrade, please refer to our new technical specifications ( http://www.realpage.com/support/new-onesite-users/ ) or contact product support at (800) 704-0154.</p>",
                "msg17": "<p>To transact with RealPage and access your information, go to the RealPage Client Portal.  It offers a variety of useful resources, such as searching the knowledge base, updating profile information, submitting product ideas, and more. To submit an enhancement idea, go to the Idea Exchange located in the RealPage Client Portal.</p>",
                "msg4": "<p>Your current password will expire in <b>{{daysToExpire}}</b> day(s).</p>"
            };

            var text = textData[msgID];

            if (data.tokenData) {
                for (var key in data.tokenData) {
                    text = text.replace('{{' + key + '}}', data.tokenData[key]);
                }
            }

            return text;
        }

        function getActionText(data) {
            var textData,
                msgID = 'msg' + data.msgID;

            textData = {
                'msg4': 'Change Password'
            };

            if (textData[msgID]) {
                return textData[msgID];
            }
        }

        bundle.set({
            'title': getTitle,
            'actionValue': getActionValue,
            'actionText': getActionText
        });

        bundle.test();
    }

    angular
        .module("rpUserMessages")
        .config(['appLangBundleProvider', config]);
})(angular);

