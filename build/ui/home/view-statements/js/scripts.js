//  Source: ui\home\view-statements\js\controllers\statements.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsCtrl($scope, $http, notifSvc, statementsMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = statementsMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.loadData();
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
        .controller("statementsCtrl", ["$scope", '$http', 'notificationService', 'statementsdMdl',
            StatementsCtrl
        ]);
})(angular);

//  Source: ui\home\view-statements\js\models\statements.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsMdl(gridConfig, gridModel, gridTransformSvc, formConfig, q, baseModel, busyIndicatorModel, statementSvc,
        dashboardSvc, timeout, stateParams, gridPaginationModel, moment, _) {
        var model = {},
            busyIndicator,
            response = {},
            grid = gridModel(),
            // gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        // var gridPaginationConfig = {
        //     currentPage: 0,
        //     pagesPerGroup: 5,
        //     recordsPerPage: 6,
        //     currentPageGroup: 0
        // };
        model.statementData = {};
        model.formConfig = formConfig;
        model.leaseArray = [];
        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            // gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());
            // gridPagination
            //     .setConfig(gridPaginationConfig);
            // model.gridPagination = gridPagination;
            grid.formConfig = formConfig;
            var DateRangeoptions = [{
                    dateRangeName: "This Year",
                    dateRangeID: "01/01/" + moment().format('YYYY')
                },
                {
                    dateRangeName: "Past 6 Months",
                    dateRangeID: moment().subtract(6, 'month').format('MM/DD/YYYY')
                },
                {
                    dateRangeName: "Past 3 Months",
                    dateRangeID: moment().subtract(3, 'month').format('MM/DD/YYYY')
                },
                {
                    dateRangeName: "Current Month",
                    dateRangeID: moment().format('MM/DD/YYYY')
                },
                {
                    dateRangeName: "Prior Month",
                    dateRangeID: moment().subtract(1, 'month').format('MM/DD/YYYY')
                }
            ];

            formConfig.setOptions("dateRange", DateRangeoptions);
            model.dateRange = moment().format('MM/DD/YYYY');
            return model;
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };


        model.loadData = function() {
            model.toggleGridState(true);
            formConfig.setMethodsSrc(model);
            dashboardSvc.getLeaseList(baseModel.LeaseIDBinding()).catch(baseModel.error).then(function(response) {
                response.data.forEach(function(item) {
                    model.leaseArray.push({ leaseID: item.LEASEID, leaseName: item.LEASEID });
                });

                formConfig.setOptions("leaseIdList", model.leaseArray);
                model.leaseId = stateParams.id;

                model.getStatement();

            });
        };

        model.getStatement = function() {
            model.toggleGridState(true);
            // var obj = {
            //     "request": {
            //         "operation": {
            //             "content": {
            //                 "function": {
            //                     "getTenantStatement": {
            //                         // "leaseid": "AH-1038",
            //                         "leaseid": model.leaseId,
            //                         "fromdate": {
            //                             "year": moment(model.dateRange).year(),
            //                             "month": moment(model.dateRange).month() + 1,
            //                             "day": "01"
            //                         },
            //                         "todate": {
            //                             "year": moment().format('YYYY'),
            //                             "month": moment().month() + 1,
            //                             "day": moment().format('DD')
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };
            statementSvc.getStatementList(baseModel.statementInput(model.leaseId, model.dateRange)).catch(baseModel.error).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    model.statementData = response.data.api[0];
                    grid.setData({
                        "records": model.statementData.payinfo
                    });
                } else {

                }
            });

        };
        // model.setData = function(data) {
        //     gridPagination.setData(data.records).goToPage({
        //         number: 0
        //     });
        // };
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

        model.onLeaseIdChange = function(value) {
            model.getStatement();
        };

        model.onDataRange = function(value) {
            model.getStatement();
        };



        return model.init();
    }

    angular
        .module("ui")
        .factory("statementsdMdl", ["staementGrid1Config", "rpGridModel", "rpGridTransform", "statementConfig", '$q',
            'baseModel', 'rpBusyIndicatorModel', 'statementSvc', 'dashboardSvc', '$timeout', '$stateParams', 'rpGridPaginationModel',
            "moment", "underscore",
            StatementsMdl
        ]);
})(angular);

//  Source: ui\home\view-statements\js\models\statements-config.js
(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.leaseIdList = menuConfig({
            nameKey: "leaseName",
            valueKey: "leaseID",
            onChange: model.getMethod("onLeaseIdChange")
        });
        model.dateRange = menuConfig({
            nameKey: "dateRangeName",
            valueKey: "dateRangeID",
            onChange: model.getMethod("onDataRange")
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
        .factory("statementConfig", [
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
                    key: "WHENCREATED"
                },
                {
                    key: "TYPE"
                },
                {
                    key: "DESCRIPTION"
                },
                {
                    key: "AMOUNT",
                    type: "currency"
                },
                {
                    key: "PAYMENT",
                    type: "currency"
                },
                {
                    key: "BALANCE",
                    type: "currency"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "WHENCREATED",
                        text: "Date",
                        isSortable: true
                    },
                    {
                        key: "TYPE",
                        text: "Transactions"
                    },
                    {
                        key: "DESCRIPTION",
                        text: "Details"
                    },
                    {
                        key: "AMOUNT",
                        text: "Amount"
                    },
                    {
                        key: "PAYMENT",
                        text: "Payments"
                    },
                    {
                        key: "BALANCE",
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
                    key: "WHENCREATED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "TYPE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Transactions"
                },
                {
                    key: "DESCRIPTION",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Details"
                },
                {
                    key: "AMOUNT",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "PAYMENT",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Payments"
                },
                {
                    key: "BALANCE",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Balance"
                }
            ];
        };
        model.getTrackSelectionConfig = function() {
            var config = {},
                columns = model.get();

            columns.forEach(function(column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };
        return model;
    }

    angular
        .module("ui")
        .factory("staementGrid1Config", ["rpGridConfig", Factory]);
})(angular);

//  Source: ui\home\view-statements\js\services\statementSvc.js
(function() {
    'use strict';


    function Factory($http) {

        return {
            getStatementList: function(obj) {
                return $http.post('/api/statement', obj);
            }
        };

    }
    angular
        .module('ui')
        .factory('statementSvc', Factory);

    Factory.$inject = ['$http'];

})();


