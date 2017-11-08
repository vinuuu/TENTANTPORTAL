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