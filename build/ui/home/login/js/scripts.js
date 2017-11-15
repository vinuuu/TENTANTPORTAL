//  Source: ui\home\login\js\controllers\login.js
(function() {
    'use strict';


    function controller(loginMdl, loginFormConfig) {
        /* jshint validthis:true */
        var vm = this,
            model;
        vm.init = function() {
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = 'email';
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

//  Source: ui\home\login\js\models\login.js
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

//  Source: ui\home\login\js\models\formconfig.js
//  Demo Form Config

(function(angular, undefined) {
    "use strict";

    function factory(baseFormConfig, radioConfig) {
        var model = baseFormConfig();
        //pettu
        model.genRadio = function(name, list) {
            list.forEach(function(item) {
                model[item.id] = radioConfig({
                    name: name
                });
            });
        };

        return model;
    }

    angular
        .module("uam")
        .factory("loginFormConfig", ["baseFormConfig", "rpFormInputRadioConfig", factory]);
})(angular);

