(function() {
    'use strict';


    function Controller(loginMdl, loginFormConfig, $scope, $remember) {
        var vm = this,
            model;
        vm.init = function() {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.checkall = false;
            model.oldPwd = '';
            model.rdnmobCode = false;
            vm.formConfig = loginFormConfig;
            model.numFlag = model.upperFlag = model.lowerFlag = model.specialCharFlag = false;
            if ($remember('username') && $remember('password')) {
                model.checkall = true;
                vm.model.username = $remember('username');
                vm.model.pwd = $remember('password');
            }
        };


        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };
        vm.rememberMe = function() {
            if (model.checkall) {
                $remember('username', vm.model.username);
                $remember('password', vm.model.pwd);
            } else {
                $remember('username', '');
                $remember('password', '');
            }
        };


        vm.init();
    }

    angular
        .module('ui')
        .controller('loginCtrl', Controller);
    Controller.$inject = ['loginMdl', 'loginFormConfig', '$scope', '$remember'];

})();