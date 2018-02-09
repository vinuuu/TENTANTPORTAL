//  Home Controller

(function(angular, undefined) {
    "use strict";

    function SettingsCtrl($scope,settingsMdl,settingsFormConfig,$aside,$timeout,baseModel,baseSvc,notifSvc) {
        var vm = this,
            model;
    
        vm.init = function() {
            vm.model=model=settingsMdl;
            vm.formConfig=settingsFormConfig;
            vm.formConfig.setMethodsSrc(vm);
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

        vm.formConfig.setOptions("securityquestion", options);
        model.securityquestion = "What is your pet's name?";
         //Model intizilizations
         //Third Party Intilizations   
         //alias names
        vm.destWatch = $scope.$on("$destroy", vm.destroy);
        vm.firstAside = $aside({
            scope: $scope,
            backdrop: true,
            show: false,
            animation: 'am-fade-and-slide-right',
            placement: 'right',
            templateUrl: 'app/templates/changepassword.html'
        });
        
            
        };
        vm.changePassword = function(){
            vm.firstAside.show();
        };
        vm.destroy = function() {
            //destrctions
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };
        vm.onPass1Change = function () {
            $timeout(vm.SavePassword.ConfirmPassword.$validate);
        };

        vm.onPass2Change = function () {
            $timeout(vm.SavePassword.changePassword.$validate);
        };

        vm.checkPass1 = function (modelValue, viewValue) {
            return viewValue == vm.model.ConfirmPassword;
        };

        vm.checkPass2 = function (modelValue, viewValue) {
            return viewValue == vm.model.changePassword;
        };
        vm.changePasswordSubmit=function(){
            // model.userToken ==SIX Digit Code 
            //model.emailCode =undefiend
            model.strUserName= sessionStorage.getItem('userName');
            baseSvc.getTenentData('api/changePwd',baseModel.forgotpwdSubmitInput(model.strUserName, model.emailCode, model.userToken, vm.model.changePassword, vm.model.ConfirmPassword)).then(function(response) {
                notifSvc.success("Password SuccessFully Changed");
            }).catch(function(exe) {
                notifSvc.error("Password Updation Failed");

            });
        };
        vm.init();
    }

    angular
        .module("ui")
        .controller("SettingsCtrl", ["$scope",'settingsMdl','settingsFormConfig','$aside','$timeout','baseModel','baseSvc','notificationService',
            SettingsCtrl
        ]);
  
})(angular);