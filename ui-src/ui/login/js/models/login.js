(function() {
    'use strict';

    function factory(langTranslate, loginSvc, formConfig, state, notifSvc, busyIndicatorModel,
        globalHeaderUsername, baseModel, storage) {
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
            model.oldPwd = '';
            loginSvc.getLoginDetails(baseModel.submitLoginInput(model.username, model.pwd)).then(function(response) {
                model.toggleGridState(false);

                if (response.data) {
                    if (response.data.api) {
                        model.oldPwd = model.pwd;
                        count = 0;
                        sessionStorage.setItem('sessionID', response.data.api[0].sessionid);
                        sessionStorage.setItem('userName', response.data.api[0].name);
                        sessionStorage.setItem('companyName', response.data.api[0].companyname);
                        sessionStorage.setItem('tenantname', response.data.api[0].tenantname);
                        storage.set('permissionsFormenu', response.data.api[0].permissions);
                        globalHeaderUsername.setUsername(response.data.api[0].name);
                        if (response.data.api[0].resetpassword === 'T') {
                            model.showHideFlag = "firstlogin";
                            model.strUserName = model.username;
                        } else {
                            state.go('home.dashbaord');}
                            model.pwdSuccess='';
                    } 
                    else {
                        var errormsg=response.data.errormessage[0].error[0].description2[0].cdata;
                        
                         if(errormsg.indexOf('attempt')!=-1){
                            model.pwdSuccess = 'warning';
                        }
                        else if(errormsg.indexOf('unlocked')!=-1){
                            model.pwdSuccess = 'locked';
                        }
                        else if(errormsg.indexOf('locked')!=-1){
                            model.pwdSuccess = 'Adminlocked';
                        }
                        else if(errormsg.indexOf('disabled')!=-1){
                            model.pwdSuccess = 'Inactive';
                        }
                        else{
                        model.pwdSuccess = 'failure';
                        }
                   
                     }
                }
            }).catch(function(exception) {
                model.toggleGridState(false);
                model.pwdSuccess = 'failure';

            });
        };
        model.dynamicMenu = function(permissions) {
            if (permissions.Documents) {
                $('.rp-global-nav-menu>li:contains("Documents")').css('display', 'none');
            } else {
                $('.rp-global-nav-menu>li:contains("Documents")').css('display', 'block');
            }
            if (permissions.Invoice) {
                $('.rp-global-nav-menu>li:contains("Invoices")').css('display', 'none');
            } else {
                $('.rp-global-nav-menu>li:contains("Invoices")').css('display', 'block');
            }

            if (permissions.Notes) {}
            if (permissions.Payments) {
                $('.rp-global-nav-menu>li:contains("Account & Payments")').css('display', 'none');
            } else {
                $('.rp-global-nav-menu>li:contains("Account & Payments")').css('display', 'block');
            }
            if (permissions["Service Request"]) {}

        };
        model.radiochange = function(val) {
            alert(val);
        };

        model.resetpwdSubmit = function(val) {
            model.toggleGridState(true);
            loginSvc.changePwd(baseModel.resetpwdSubmitInput(model.pwd1, model.pwd2, model.oldPwd, model.securityquestion, model.security_a)).then(function(response) {
                model.toggleGridState(false);
                if (response.data && response.data.api[0].status === 'success') {
                    notifSvc.removeNotifications();
                    notifSvc.success(response.data.api[0].message);
                    if (model.showHideFlag === 'firstlogin') {
                        state.go('home.dashbaord');
                    } else {

                    }
                }
            });
        };



        model.checkUserName = function(val) {
            model.toggleGridState(true);
            loginSvc.forgotPwd(baseModel.checkUserNameInput(model.u_e_id)).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.securityQusn = response.data.api[0].secquestion;
                        model.showHideFlag = val;
                        model.strUserName = model.u_e_id;
                        model.strErrUSernameFlag = false;
                    }
                } else {
                    model.strErrUSernameFlag = true;
                    model.elseErrMessage(response.data);
                }
            }).catch(function(exe) {
                model.toggleGridState(false);
                model.strErrUSernameFlag = true;
                model.elseErrMessage(exe.data);
            });
        };

        model.answerSecurityQusn = function(val) {
            model.toggleGridState(true);

            loginSvc.forgotPwd(baseModel.answerSecurityQusnInput(model.strUserName, model.securityQusn, model.question1)).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = val;
                        model.strErrQusn = false;
                        notifSvc.success(response.data.api[0].message);
                    }
                } else {
                    model.strErrQusn = true;
                    model.elseErrMessage(response.data);
                }
            }).catch(function(exe) {
                model.toggleGridState(false);
                model.strErrQusn = true;
                model.elseErrMessage(exe.data);
            });
        };

        model.checkSixDigitCode = function(val) {
            model.toggleGridState(true);
            loginSvc.forgotPwd(baseModel.checkSixDigitCodeInput(model.strUserName, model.emailCode)).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = val;
                        model.userToken = response.data.api[0].usertoken;
                        model.strErrVerifyCode = false;
                    }
                } else {
                    model.strErrVerifyCode = true;
                    model.elseErrMessage(response.data);
                }
            }).catch(function(exe) {
                model.toggleGridState(false);
                model.strErrVerifyCode = true;
                model.elseErrMessage(exe.data);
            });
        };

        model.forgotpwdSubmit = function() {
            model.toggleGridState(true);

            loginSvc.forgotPwd(baseModel.forgotpwdSubmitInput(model.strUserName, model.emailCode, model.userToken, model.pwd1, model.pwd2)).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    if (response.data.api[0].status === 'success') {
                        model.showHideFlag = 'login';
                        model.pwdSuccess = 'success';
                    }
                }
            }).catch(function(exe) {
                model.toggleGridState(false);
                notifSvc.error(model.elseErrMessage(exe.data));

            });
        };

        model.elseErrMessage = function(exception) {
            model.elseStr = exception.errormessage[0].error[0].description[0].cdata !== '' ? exception.errormessage[0].error[0].description[0].cdata : exception.errormessage[0].error[0].description2[0].cdata;
            return model.elseStr;
        };
        return model.init();
    }

    angular
        .module('ui')
        .factory('loginMdl', factory);

    factory.$inject = ["appLangTranslate", "loginSvc", "loginFormConfig", '$state',
        'notificationService', 'rpBusyIndicatorModel', 'globalHeaderUsername', 'baseModel', 'rpSessionStorage',
    ];

})();