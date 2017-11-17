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