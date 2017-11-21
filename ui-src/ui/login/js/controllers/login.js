(function() {
    'use strict';


    function Controller(loginMdl, loginFormConfig, $scope) {
        var vm = this,
            model;
        vm.init = function() {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            // model.rdnEmailCode = 'email';
            model.rdnmobCode = false;
            vm.formConfig = loginFormConfig;
            model.numFlag = model.upperFlag = model.lowerFlag = model.specialCharFlag = false;
        };


        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };


        vm.init();
    }

    angular
        .module('ui')
        .controller('loginCtrl', Controller);
    Controller.$inject = ['loginMdl', 'loginFormConfig', '$scope'];

})();