//  Home Controller

(function() {
    "use strict";

    function settingsMdl(langTranslate) {
        var model = {},
            busyIndicator;
            var translate = langTranslate('Profile Information').translate;

        model.init = function() {            
            model.pageHeading= translate('Header');
            model.field01="Rocks";
            model.UserName="kian.chitikena@realpage.com";
            model.EmailAddress="kian.chitikena@realpage.com";
            model.Password="k123456";
            model.RecoveryEmailID="kian.chitikena@realpage.com";
            model.RecoveryMobNumber="999999999";
            model.firstName=sessionStorage.getItem('firstname');
            model.lastName=sessionStorage.getItem('lastname');
            return model;
        };


        return model.init();
    }

    angular
        .module("ui")
        .factory("settingsMdl", settingsMdl);
    settingsMdl.$inject = ['appLangTranslate'];
})(angular);
