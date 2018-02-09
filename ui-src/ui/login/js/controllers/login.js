(function() {
    'use strict';


    function Controller(loginMdl, loginFormConfig, $scope, $remember, http, state) {
        var vm = this,
            model;
        vm.init = function() {
            /*if (sessionStorage.getItem('sessionID')) {
                //var URL="https://rpidevntw008.realpage.com/users/sarroju/Q12018RELEASE-QA.accounting/tenant/apigw.phtml";
                var URL = 'api/logout';
                http.post(URL,
                    {
                        "request": {
                        "operation": {
                            "content": {
                            "function": {
                                "getlogout": {}
                            }
                            }
                        }
                        }
                    }
                ).then(function(){
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('companyName');
                    state.go('login');
                });
            }*/

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
            else{
                vm.model.username = "";
                vm.model.pwd = "";
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
    Controller.$inject = ['loginMdl', 'loginFormConfig', '$scope', '$remember', '$http', '$state'];

})();