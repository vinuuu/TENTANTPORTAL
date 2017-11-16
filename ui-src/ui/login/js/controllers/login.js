(function() {
    'use strict';


    function Controller(loginMdl, loginFormConfig) {
        var vm = this,
            model;
        vm.init = function() {
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = 'email';
            model.rdnmobCode = false;
            vm.formConfig = loginFormConfig;
        };

        vm.init();
    }

    angular
        .module('uam')
        .controller('loginCtrl', Controller);
    Controller.$inject = ['loginMdl', 'loginFormConfig'];

})();