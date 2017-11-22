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
        model.init = function() {
            model.securityquestion = "1";
            return model;
        };
        model.showhideDiv = function(val) {
            model.showHideFlag = val;
            model.pwdSuccess = false;
        };
        formConfig.setMethodsSrc(model);
        var options = [{
                securityQuesnName: "What is your pet's name?",
                securityQuesnID: "What is your pet's name?"
            },
            {
                securityQuesnName: "What is your mother's maiden name?",
                securityQuesnID: "What is your mother's maiden name?"
            },
            {
                securityQuesnName: "What is your favorite color?",
                securityQuesnID: "What is your favorite color?"
            },
            {
                securityQuesnName: "What city were you born in?",
                securityQuesnID: "What city were you born in?"
            },
            {
                securityQuesnName: "What town was your mother born in?",
                securityQuesnID: "What town was your mother born in?"
            },
            {
                securityQuesnName: "What town was your father born in?",
                securityQuesnID: "What town was your father born in?"
            },
            {
                securityQuesnName: "Where did you meet your spouse?",
                securityQuesnID: "Where did you meet your spouse?"
            },
            {
                securityQuesnName: "What was the make of your first car?",
                securityQuesnID: "What was the make of your first car?"
            },
            {
                securityQuesnName: "What is the name of the street on which you grew up on?",
                securityQuesnID: "What is the name of the street on which you grew up on?"
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
        var count = 0;

        model.submitLogin = function() {

            var inputObj = {
                "request": {
                    "operation": {
                        "authentication": {
                            "login": {
                                "userid": model.username,
                                "password": model.pwd
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
            model.oldPwd = '';
            loginSvc.getLoginDetails(inputObj).then(function(response) {
                if (response.data) {
                    if (response.data.api) {
                        model.oldPwd = model.pwd;
                        count = 0;
                        sessionStorage.setItem('sessionID', response.data.api[0].sessionid);
                        sessionStorage.setItem('userName', response.data.api[0].name);
                        sessionStorage.setItem('companyName', response.data.api[0].companyname);
                        if (response.data.api[0].resetpassword === 'T') {
                            model.showHideFlag = "firstlogin";
                            model.strUserName = model.username;
                        } else {
                            state.go('home.dashbaord');
                        }

                    } else {
                        if (count === 0) {
                            model.pwdSuccess = 'failure';
                            count++;
                        } else if (count === 1) {
                            count++;
                            model.pwdSuccess = 'warning';
                        } else {
                            model.pwdSuccess = 'locked';
                        }
                    }
                }
            });

        };

        model.checkUserName = function(val) {
            model.showHideFlag = val;
            model.strUserName = model.u_e_id;
        };

        model.sendVerifycode = function(val) {
            model.showHideFlag = 'confirmpwd';
            model.displaymob_email = model.emailCode ? model.emailCode : (model.mobcode1 ? model.mobcode1 : '');
        };
        model.radiochange = function(val) {
            alert(val);
        };

        model.resetpwdSubmit = function(val) {

            var changeInputObj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getchangepwd": {
                                    "pwdtype": model.showHideFlag === 'firstlogin' ? "login" : "change",
                                    "newpwd": model.pwd1,
                                    "oldpwd": model.oldPwd,
                                    "cnfrmpwd": model.pwd2,
                                    "secquestion": model.securityquestion,
                                    "secanswer": model.security_a
                                }
                            }
                        }
                    }
                }
            };
            loginSvc.changePwd(changeInputObj).then(function(response) {
                if (response.data && response.data.api[0].status === 'success') {
                    alert(response.data.api[0].message);
                    if (model.showHideFlag === 'firstlogin') {
                        state.go('home.dashbaord');
                    } else {
                        model.showHideFlag = 'login';
                        model.pwdSuccess = 'success';
                    }
                }
            });
        };


        return model.init();
    }

    angular
        .module('ui')
        .factory('loginMdl', factory);

    factory.$inject = ["appLangTranslate", "loginSvc", "loginFormConfig", '$state'];

})();