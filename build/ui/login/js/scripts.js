//  Source: ui\login\js\controllers\login.js
(function() {
    'use strict';


    function Controller(loginMdl, loginFormConfig, $scope) {
        var vm = this,
            model;
        vm.init = function() {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.model = model = loginMdl;
            model.showHideFlag = "login";
            model.rdnEmailCode = 'email';
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
        .module('uam')
        .controller('loginCtrl', Controller);
    Controller.$inject = ['loginMdl', 'loginFormConfig', '$scope'];

})();

//  Source: ui\login\js\models\login.js
(function() {
    'use strict';

    function factory(langTranslate, loginSvc, formConfig, state) {
        var model = {},
            translate = langTranslate('login').translate;
        model.formConfig = formConfig;
        model.strUserName = '';
        model.translateNames = function(key) {
            return translate(key);
        };

        model.showhideDiv = function(val) {
            model.showHideFlag = val;
            model.pwdSuccess = false;
        };
        formConfig.setMethodsSrc(model);
        var options = [{
                securityQuesnName: "What is your pet's name?",
                securityQuesnID: "1"
            },
            {
                securityQuesnName: "What is your mother's maiden name?",
                securityQuesnID: "2"
            },
            {
                securityQuesnName: "What is your favorite color?",
                securityQuesnID: "3"
            },
            {
                securityQuesnName: "What city were you born in?",
                securityQuesnID: "4"
            },
            {
                securityQuesnName: "What town was your mother born in?",
                securityQuesnID: "5"
            },
            {
                securityQuesnName: "What town was your father born in?",
                securityQuesnID: "6"
            },
            {
                securityQuesnName: "Where did you meet your spouse?",
                securityQuesnID: "7"
            },
            {
                securityQuesnName: "What was the make of your first car?",
                securityQuesnID: "8"
            },
            {
                securityQuesnName: "What is the name of the street on which you grew up on?",
                securityQuesnID: "9"
            }
        ];

        formConfig.setOptions("securityquestion", options);

        model.pwdValidation = function(val) {

            var regNumber = /(?=.*\d)/,
                regUcase = /(?=.*[A-Z])/,
                regLcase = /(?=.*[a-z])/,
                regSpecialchars = /(?=.*[$@$!%*#?&])/;

            model.numFlag = val === undefined ? false : regNumber.test(val);
            model.upperFlag = val === undefined ? false : regUcase.test(val);
            model.lowerFlag = val === undefined ? false : regLcase.test(val);
            model.specialCharFlag = val === undefined ? false : regSpecialchars.test(val);
        };


        //submit user name and pwd to api
        model.submitLogin = function() {
            model.showHideFlag = "firstlogin";
            model.strUserName = model.username;


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
                if (response.data) {
                    sessionStorage.setItem('sessionID', response.data.api[0].sessionid[0]);
                    sessionStorage.setItem('userName', response.data.api[0].name[0]);
                    sessionStorage.setItem('companyName', response.data.api[0].companyname[0]);
                }
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
            if (model.showHideFlag === 'confirmpwd') {
                model.showHideFlag = 'login';
                model.pwdSuccess = true;
            } else {

                state.go('');
            }

        };


        return model;
    }

    angular
        .module('uam')
        .factory('loginMdl', factory);

    factory.$inject = ["appLangTranslate", "loginSvc", "loginFormConfig", '$state'];

})();

//  Source: ui\login\js\models\formconfig.js
//  Demo Form Config

(function(angular, undefined) {
    "use strict";

    function factory(baseFormConfig, radioConfig, menuConfig) {
        var model = baseFormConfig();
        //pettu
        model.genRadio = function(name, list) {
            list.forEach(function(item) {
                model[item.id] = radioConfig({
                    name: name
                });
            });
        };


        model.securityquestion = menuConfig({
            nameKey: "securityQuesnName",
            valueKey: "securityQuesnID"
        });

        model.setOptions = function(fieldName, fieldOptions) {
            if (model[fieldName]) {
                model[fieldName].setOptions(fieldOptions);
            } else {
                return model;
            }
        };

        return model;
    }

    angular
        .module("uam")
        .factory("loginFormConfig", ["baseFormConfig", "rpFormInputRadioConfig", "rpFormSelectMenuConfig", factory]);
})(angular);

//  Source: ui\login\js\directives\match.js
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

//  Source: ui\login\js\services\loginSvc.js
(function() {
    'use strict';



    function factory($http) {
        return {
            getLoginDetails: function(obj) {
                return $http.post('/api/login', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('loginSvc', factory);

    factory.$inject = ['$http'];


})();

