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

    function factory(langTranslate, loginSvc) {
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

        //submit user name and pwd to api
        model.submitLogin = function() {
            var inputObj = {
                "request": {
                    "operation": {
                        "authentication": {
                            "login": {
                                "userid": "srihari@realpage.com",
                                "password": "sriharI$4"
                            }
                        },
                        "content": {
                            "function": {
                                "getTPAPISession": {}
                            }
                        }
                    }
                }
            };


            loginSvc.getLoginDetails(inputObj).then(function(response) {


            });


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

    factory.$inject = ["appLangTranslate", "loginSvc"];

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

//  Source: ui\home\login\js\directives\match.js
(function() {
    'use strict';
    var directiveId = 'ngMatch';

    function directive($parse) {

        function link(scope, elem, attrs, ctrl) {
            // if ngModel is not defined, we don't need to do anything
            if (!ctrl) {
                return;
            }
            if (!attrs[directiveId]) {
                return;
            }

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function(value) {
                var temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function() {
                validator(ctrl.$viewValue);
            });



        }


        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };
        return directive;


    }


    angular
        .module('uam').directive(directiveId, directive);

    directive.$inject = ['$parse'];

})();

//  Source: ui\home\login\js\services\loginSvc.js
(function() {
    'use strict';



    function factory($http) {
        return {
            getLoginDetails: function(obj) {
                return $http.post('http://rpidevntw008.realpage.com/users/sarroju/RPGITSERVICES.accounting/tenant/apigw.phtml', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];


})();

