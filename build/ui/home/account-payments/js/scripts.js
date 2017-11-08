//  Source: ui\home\account-payments\js\controllers\accounts.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl, formConfig) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = accountsMdl;
            vm.formConfig = formConfig;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.getCustData();

            formConfig.setMethodsSrc(vm);
            var options = [{
                    accountHisrotyName: "Current Month",
                    accountHisrotyNameID: "0"
                },
                {
                    accountHisrotyName: "last 3 Month",
                    accountHisrotyNameID: "01"
                },
                {
                    accountHisrotyName: "last 6 Month",
                    accountHisrotyNameID: "02"
                }
            ];

            formConfig
                .setOptions("accountHistory", options);
            formConfig.setOptions("leaseData", options);

        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("uam")
        .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl', 'sampleSelectMenuFormConfig', AccountsCtrl]);
})(angular);

//  Source: ui\home\account-payments\js\models\accounts.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function accountsMdl(accountsSvc) {
        var model = {},
            //translate = langTranslate('error').translate,
            response = {};
        model.init = function() {
            return model;
        };
        // model.translateNames = function(key) {
        //     return translate(key);
        // };
        model.mockData = function() {
            response.custData = {
                tenantName: 'Kim Resident',
                leaseTerm: '1/1/2016-12/31/2018',
                PrevoiusStatement: 'XXXXXXXXXXXXXXXX',
                PreviousBalance: '$27,885.14',
                lastPayment: '$27,885.16',
                lastPaymentReceivedOn: '1/1/2016',
                currentStatement: 'XXXXXXXXXXXX',
                currentBalance: '$27,885.14',
                dueDate: '2/1/2016'
            };
            model.accountHistory = "01";
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.getCustData = function() {
            // accountsSvc.getcustData().then(function() {

            // }).catch(function() {
            model.mockData();
            // });
        };



        return model;
    }

    angular
        .module("uam")
        .factory("accountsMdl", [accountsMdl]);
    accountsMdl.$inject = ['accountsSvc'];
})(angular);

//  Source: ui\home\account-payments\js\models\accounts-config.js
(function(angular) {
    "use strict";

    function factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
        });
        model.leaseData = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
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
        .factory("sampleSelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            factory
        ]);
})(angular);


