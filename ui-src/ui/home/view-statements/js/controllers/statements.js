//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsCtrl($scope, $http, notifSvc, statementsMdl, formConfig) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = statementsMdl.init();
            vm.formConfig = formConfig;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);


            formConfig.setMethodsSrc(vm);
            var options = [{
                    accountHisrotyName: "Lease ID : 123456",
                    accountHisrotyNameID: "0"
                },
                {
                    accountHisrotyName: "Lease ID : 123457",
                    accountHisrotyNameID: "01"
                },
                {
                    accountHisrotyName: "Lease ID : 123458",
                    accountHisrotyNameID: "02"
                }
            ];

            formConfig.setOptions("accountHistory", options);





        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("statementsCtrl", ["$scope", '$http', 'notificationService', 'statementsdMdl', 'statementSelectMenuFormConfig', StatementsCtrl]);
})(angular);