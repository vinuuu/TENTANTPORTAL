(function() {
    'use strict';

    function factory(langTranslate, loginSvc, formConfig, state, notifSvc, busyIndicatorModel) {
        var model = {},
            busyIndicator,
            translate = langTranslate('login').translate;
        model.formConfig = formConfig;
        model.strUserName = '';
        model.translateNames = function(key) {
            return translate(key);
        };
        model.toggleGridState = function(flg) {
            if (flg) {
                model.apiReady = false;
                busyIndicator.busy();
            } else {
                model.apiReady = true;
                busyIndicator.off();
            }

            return model;
        };

        model.init = function() {
            model.securityquestion = "1";
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            return model;
        };
        model.showhideDiv = function(val) {
            model.showHideFlag = val;
            model.pwdSuccess = false;
        };
        formConfig.setMethodsSrc(model);
        var options = [{
                securityQuesnID: "What is your pet's name?"
            },
            {
                securityQuesnID: "What is your mother's maiden name?"
            },
            {
                securityQuesnID: "What is your favorite color?"
            },
            {
                securityQuesnID: "What city were you born in?"
            },
            {
                securityQuesnID: "What town was your mother born in?"
            },
            {
                securityQuesnID: "What town was your father born in?"
            },
            {
                securityQuesnID: "Where did you meet your spouse?"
            },
            {
                securityQuesnID: "What was the make of your first car?"
            },
            {
                securityQuesnID: "What is the name of the street on which you grew up on?"
            }
        ];

        formConfig.setOptions("securityquestion", options);
        model.securityquestion = "What is your pet's name?";
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
            model.toggleGridState(true);
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
                model.toggleGridState(false);

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


        // model.sendVerifycode = function(val) {
        //     model.showHideFlag = 'confirmpwd';
        //     model.displaymob_email = model.emailCode ? model.emailCode : (model.mobcode1 ? model.mobcode1 : '');
        // };
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
                    notifSvc.removeNotifications();
                    notifSvc.success(response.data.api[0].message);
                    if (model.showHideFlag === 'firstlogin') {
                        state.go('home.dashbaord');
                    } else {
                        // model.showHideFlag = 'login';
                        // model.pwdSuccess = 'success';
                    }
                }
            });
        };



        model.checkUserName = function(val) {

            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "question",
                                    "userid": model.u_e_id
                                }
                            }
                        }
                    }
                }
            };

            loginSvc.forgotPwd(obj).then(function(response) {
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.securityQusn = response.data.api[0].secquestion;
                        model.showHideFlag = val;
                        model.strUserName = model.u_e_id;
                    }
                }
            });
        };

        model.answerSecurityQusn = function(val) {
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "authcode",
                                    "userid": model.strUserName,
                                    "secquestion": model.securityQusn,
                                    "secanswer": model.question1
                                }
                            }
                        }
                    }
                }
            };

            loginSvc.forgotPwd(obj).then(function(response) {
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = val;
                        alert(response.data.api[0].message);
                    }
                }
            });
        };

        model.checkSixDigitCode = function(val) {
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "validateauthcode",
                                    "userid": model.strUserName,
                                    // "authcode": "154418"
                                    "authcode": model.emailCode
                                }
                            }
                        }
                    }
                }
            };

            loginSvc.forgotPwd(obj).then(function(response) {
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = val;
                        model.userToken = response.data.api[0].usertoken;
                        alert(response.data.api[0].message);
                    }
                }
            });
        };

        model.forgotpwdSubmit = function(val) {
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getforgotpwd": {
                                    "type": "changepassword",
                                    "userid": model.strUserName,
                                    "authcode": model.emailCode,
                                    // "authcode": "154418",
                                    "usertoken": model.userToken,
                                    "newpwd": model.pwd1,
                                    "cnfrmpwd": model.pwd2
                                }
                            }
                        }
                    }
                }
            };

            loginSvc.forgotPwd(obj).then(function(response) {
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = 'login';
                        model.pwdSuccess = 'success';
                        // alert(response.data.api[0].message);
                    }
                }
            });
        };



        return model.init();
    }

    angular
        .module('ui')
        .factory('loginMdl', factory);

    factory.$inject = ["appLangTranslate", "loginSvc", "loginFormConfig", '$state', 'notificationService', 'rpBusyIndicatorModel'];

})();