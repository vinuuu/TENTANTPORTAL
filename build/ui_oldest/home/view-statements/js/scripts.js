//  Source: ui\home\view-statements\js\controllers\statements.js
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

//  Source: ui\home\view-statements\js\models\statements.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsMdl(gridConfig, gridModel, gridTransformSvc) {
        var model = {},
            response = {},
            grid = gridModel(),
            gridTransform = gridTransformSvc();
        model.init = function() {
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            model.loadData();
            return model;
        };
        model.mockData = function() {

            model.bindtenantdata(response);
        };
        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.loadData = function() {
            grid.setData({
                "records": [{
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "kkkk",
                        "Balance": "hjhhhj"
                    },
                    {
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "jjjj",
                        "Balance": "11,000.00"
                    },
                    {
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "bbb",
                        "Balance": "11,000.00"
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };


        return model;
    }

    angular
        .module("ui")
        .factory("statementsdMdl", ["staementGrid1Config",
            "rpGridModel",
            "rpGridTransform", StatementsMdl
        ]);
})(angular);

//  Source: ui\home\view-statements\js\models\statements-config.js
(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
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
        .module("ui")
        .factory("statementSelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            Factory
        ]);
})(angular);

//  Source: ui\home\view-statements\js\models\gridModel.js
(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [{
                    key: "Date"
                },
                {
                    key: "Transactions"
                },
                {
                    key: "Details"
                },
                {
                    key: "Amount"
                },
                {
                    key: "Payments"
                },
                {
                    key: "Balance"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "Date",
                        text: "Date",
                        isSortable: true
                    },
                    {
                        key: "Transactions",
                        text: "Transactions"
                    },
                    {
                        key: "Details",
                        text: "Details"
                    },
                    {
                        key: "Amount",
                        text: "Amount"
                    },
                    {
                        key: "Payments",
                        text: "Payments"
                    },
                    {
                        key: "Balance",
                        text: "Balance"
                    }
                ]
            ];
        };

        // model.getGroupHeaders = function() {
        //     return [
        //         [{
        //                 text: ""
        //             },
        //             {
        //                 text: "Employee Details-1",
        //                 colSpan: 2
        //             },
        //             {
        //                 text: "Employee Details-2",
        //                 colSpan: 3
        //             }
        //         ]
        //     ];
        // };

        model.getFilters = function() {
            return [{
                    key: "Date",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "Transactions",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Transactions"
                },
                {
                    key: "Details",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Details"
                },
                {
                    key: "Amount",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "Payments",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Payments"
                },
                {
                    key: "Balance",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Balance"
                }
            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("staementGrid1Config", ["rpGridConfig", Factory]);
})(angular);


