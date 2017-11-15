(function() {
    'use strict';


    function controller(loginMdl, loginFormConfig) {
        /* jshint validthis:true */
        var vm = this,
            model;
        vm.init = function() {
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = true;
            model.rdnmobCode = false;
            vm.formConfig = loginFormConfig;

            model.pizzas = [{
                    id: "pizza1",
                    name: "Cheese"
                },

                {
                    id: "pizza2",
                    name: "Pepperoni"
                },

                {
                    id: "pizza3",
                    name: "Sausage"
                }
            ];

            loginFormConfig.setMethodsSrc(vm);
            loginFormConfig.genRadio("pizza", model.pizzas);
        };

        vm.init();
    }

    angular
        .module('uam')
        .controller('loginCtrl', controller);
    controller.$inject = ['loginMdl', 'loginFormConfig'];

})();