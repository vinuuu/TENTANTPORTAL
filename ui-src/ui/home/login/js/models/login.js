(function() {
    'use strict';

    function factory(langTranslate) {
        var model = {},
            translate = langTranslate('login').translate;
        model.strUserName = '';
        model.translateNames = function(key) {
            return translate(key);
        };

        model.showhideDiv = function(val) {
            model.showHideFlag = val;
            model.pwdSuccess = false;
        };

        model.checkUserName = function(val) {
            model.showHideFlag = val;
            model.strUserName = model.u_e_id;
        };


        model.sendVerifycode = function(val) {
            model.showHideFlag = 'sentCode';
            model.displaymob_email = model.emailCode ? model.emailCode : (model.mobcode1 ? model.mobcode1 : '');
        };
        model.radiochange = function(val) {
            alert(val);
        };

        model.resetpwdSubmit = function(val) {
            model.showHideFlag = 'login';
            model.pwdSuccess = true;
        };


        return model;
    }

    angular
        .module('uam')
        .factory('loginMdl', factory);

    factory.$inject = ["appLangTranslate"];

})();