(function() {
    'use strict';

    function factory($http) {
        var model = {};

        model.showhideDiv = function(val) {
            model.showHideFlag = val;
            model.pwdSuccess = false;
        };
        model.sendVerifycode = function(val) {
            model.showHideFlag = 'sentCode';
            model.displaymob_email = model.emailCode ? model.emailCode : (model.mobcode1 ? model.mobcode1 : '');
        };
        model.radiochange = function(val) {
            alert(val);
        };

        model.resetpwd = function(val) {
            model.showHideFlag = 'login';
            model.pwdSuccess = true;
        };


        return model;
    }

    angular
        .module('uam')
        .factory('loginMdl', factory);

    factory.$inject = ['$http'];

})();