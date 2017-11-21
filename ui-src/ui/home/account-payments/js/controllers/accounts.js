//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl, formConfig, gridConfig, gridModel, gridTransformSvc, accountsContent) {
        var vm = this,
            model,
            content = accountsContent,
            grid = gridModel(),
            gridTransform = gridTransformSvc();
        $scope.response = {};

        vm.init = function() {
            vm.model = model = accountsMdl;
            var ddd = model.response.custData;
            vm.content = content;
            vm.formConfig = formConfig;
            // vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.mockData();

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

            vm.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            vm.loadData();
            vm.vaaaaa = "hhhhhh";

        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };


        vm.loadData = function() {
            grid.setData({
                "records": [{
                        "id": 1,
                        "name": "Tiger Nixon",
                        "title": "System Architect",
                        "location": "Edinburgh",
                        "extn": "5421",
                        "startDate": "2011/04/25",
                        "salary": 320800,
                        "isRemote": false
                    },
                    {
                        "id": 49,
                        "name": "Zorita Serrano",
                        "title": "Software Engineer",
                        "location": "San Francisco",
                        "extn": "4389",
                        "startDate": "2012/06/01",
                        "salary": 115000,
                        "isRemote": false
                    },
                    {
                        "id": 50,
                        "name": "Jennifer Acosta",
                        "title": "Junior Javascript Developer",
                        "location": "Edinburgh",
                        "extn": "3431",
                        "startDate": "2013/02/01",
                        "salary": 75650,
                        "isRemote": false
                    },
                    {
                        "id": 51,
                        "name": "Cara Stevens",
                        "title": "Sales Assistant",
                        "location": "New York",
                        "extn": "3990",
                        "startDate": "2011/12/06",
                        "salary": 145600,
                        "isRemote": false
                    },
                    {
                        "id": 52,
                        "name": "Hermione Butler",
                        "title": "Regional Director",
                        "location": "London",
                        "extn": "1016",
                        "startDate": "2011/03/21",
                        "salary": 356250,
                        "isRemote": false
                    },
                    {
                        "id": 53,
                        "name": "Lael Greer",
                        "title": "Systems Administrator",
                        "location": "London",
                        "extn": "6733",
                        "startDate": "2009/02/27",
                        "salary": 103500,
                        "isRemote": false
                    },
                    {
                        "id": 54,
                        "name": "Jonas Alexander",
                        "title": "Developer",
                        "location": "San Francisco",
                        "extn": "8196",
                        "startDate": "2010/07/14",
                        "salary": 86500,
                        "isRemote": false
                    },
                    {
                        "id": 55,
                        "name": "Shad Decker",
                        "title": "Regional Director",
                        "location": "Edinburgh",
                        "extn": "6373",
                        "startDate": "2008/11/13",
                        "salary": 183000,
                        "isRemote": false
                    },
                    {
                        "id": 56,
                        "name": "Michael Bruce",
                        "title": "Javascript Developer",
                        "location": "Singapore",
                        "extn": "5384",
                        "startDate": "2011/06/27",
                        "salary": 183000,
                        "isRemote": false
                    },
                    {
                        "id": 57,
                        "name": "Donna Snider",
                        "title": "Customer Support",
                        "location": "New York",
                        "extn": "4226",
                        "startDate": "2011/01/25",
                        "salary": 112000,
                        "isRemote": false
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl',
            'sampleSelectMenuFormConfig', "sampleGrid1Config",
            "rpGridModel",
            "rpGridTransform", "accountsContent",
            AccountsCtrl
        ]);
})(angular);