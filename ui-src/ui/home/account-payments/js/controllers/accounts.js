//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl, accountsContent) {
        // function AccountsCtrl($scope, $http, notifSvc, accountsMdl, formConfig, gridConfig, gridModel, gridTransformSvc, accountsContent) {
        var vm = this,
            model,
            content = accountsContent;
        // grid = gridModel(),
        // gridTransform = gridTransformSvc();
        $scope.response = {};

        vm.init = function() {
            vm.model = model = accountsMdl;
            var ddd = model.response.custData;
            vm.content = content;
            // vm.formConfig = formConfig;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.mockData();

            // formConfig.setMethodsSrc(vm);
            // var options = [{
            //         accountHisrotyName: "Current Month",
            //         accountHisrotyNameID: "0"
            //     },
            //     {
            //         accountHisrotyName: "last 3 Month",
            //         accountHisrotyNameID: "01"
            //     },
            //     {
            //         accountHisrotyName: "last 6 Month",
            //         accountHisrotyNameID: "02"
            //     }
            // ];

            // formConfig
            //     .setOptions("accountHistory", options);
            // formConfig.setOptions("leaseData", options);

            // vm.grid = grid;
            // gridTransform.watch(grid);
            // grid.setConfig(gridConfig);
            // vm.loadData();
            vm.vaaaaa = "hhhhhh";

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
        .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl',
            "accountsContent",
            AccountsCtrl
        ]);
    // angular
    //     .module("ui")
    //     .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl',
    //         'sampleSelectMenuFormConfig', "sampleGrid1Config",
    //         "rpGridModel",
    //         "rpGridTransform", "accountsContent",
    //         AccountsCtrl
    //     ]);
})(angular);