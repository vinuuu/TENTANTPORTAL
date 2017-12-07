//  Source: ui\home\account-payments\js\controllers\accounts.js
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
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.model = model = accountsMdl;
            var ddd = model.response.custData;
            vm.content = content;
            // vm.formConfig = formConfig;
            // model.mockData();

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

//  Source: ui\home\account-payments\js\models\accounts.js
//  Home Controller

(function() {
    "use strict";

    function AccountsMdl(accountsSvc, formConfig, gridConfig, gridModel, gridTransformSvc,
        dashboardSvc, baseModel, busyIndicatorModel, invoiceSvc, gridPaginationModel, moment, q) {
        var model = {},
            busyIndicator,

            // translate = langTranslate('error').translate,
            grid = gridModel(),
            gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        var gridPaginationConfig = {
            currentPage: 0,
            pagesPerGroup: 5,
            recordsPerPage: 6,
            currentPageGroup: 0
        };
        model.response = {};
        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            model.leaseArray = [];
            formConfig.setMethodsSrc(model);
            model.formConfig = formConfig;
            var options = [{
                    accountHisrotyName: "Current Month",
                    accountHisrotyNameID: moment().format('YYYY MM DD')
                },
                {
                    accountHisrotyName: "last 3 Month",
                    accountHisrotyNameID: moment().subtract(3, 'month').format('YYYY MM DD')
                },
                {
                    accountHisrotyName: "last 6 Month",
                    accountHisrotyNameID: moment().subtract(6, 'month').format('YYYY MM DD')
                }
            ];

            formConfig
                .setOptions("accountHistory", options);

            model.accountHistoryType = moment().format('YYYY MM DD');
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            gridPagination.setGrid(grid);
            gridPagination
                .setConfig(gridPaginationConfig);
            model.gridPagination = gridPagination;
            grid.formConfig = formConfig;
            model.bindLeaseIDToDDl();
            return model;
        };


        model.onaccountHistorySelection = function(key) {
            model.getCustData({ leaseid: model.leaseid, asofDate: moment(key) });
        };
        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.onleaseDataSelection = function(key) {
            model.getCustData({ leaseid: key, asofDate: moment(model.accountHistoryType) });

        };

        model.bindLeaseIDToDDl = function() {
            model.toggleGridState(true);
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "leaseoccupancy",
                                    "fields": "",
                                    "query": "",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };
            dashboardSvc.getLeaseList(obj).catch(baseModel.error).then(function(response) {
                response.data.forEach(function(item) {
                    model.leaseArray.push({ accountHisrotyNameID: item.LEASEID, accountHisrotyName: 'LeaseID :' + item.LEASEID });
                });

                formConfig.setOptions("leaseData", model.leaseArray);
                model.accountHistory = model.leaseArray[0].accountHisrotyNameID;
                model.getCustData({ leaseid: model.accountHistory, asofDate: moment(model.accountHistoryType) });
                model.toggleGridState(false);

            });

        };

        model.getCustData = function(data) {
            model.toggleGridState(true);
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getTenantBalance": {
                                    "leaseid": data.leaseid,
                                    "asofdate": {
                                        "year": data.asofDate.year(),
                                        "month": (data.asofDate.month() + 1),
                                        "day": "01"
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var inputObj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    "query": "(LEASEID = '" + data.leaseid + "')",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

            q.all([accountsSvc.getAccountsInfo(obj),
                invoiceSvc.getInvoiceList(inputObj)

            ]).catch(baseModel.error).then(function(data) {
                model.toggleGridState(false);
                model.custData = data[0].data.api[0];
                gridPagination.setData(data[1].data).goToPage({
                    number: 0
                });

            });

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
        return model.init();
    }

    angular
        .module("ui")
        .factory("accountsMdl", AccountsMdl);
    AccountsMdl.$inject = ['accountsSvc', 'accountsConfig', "sampleGrid1Config",
        "rpGridModel",
        "rpGridTransform",
        'dashboardSvc',
        'baseModel',
        'rpBusyIndicatorModel', 'invoiceSvc', 'rpGridPaginationModel', 'moment',
        '$q'
    ];
})(angular);

//  Source: ui\home\account-payments\js\models\accounts-config.js
(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID",
            onChange: model.getMethod("onaccountHistorySelection")
        });
        model.leaseData = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID",
            onChange: model.getMethod("onleaseDataSelection")
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
        .factory("accountsConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            Factory
        ]);
})(angular);

//  Source: ui\home\account-payments\js\models\gridModel.js
(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [

                {
                    key: "Date"
                },
                {
                    key: "RECORDNO",
                },
                {
                    key: "LEASEID"

                },
                {
                    key: "UNITID"
                },
                {
                    key: "TOTALENTERED",
                    type: "currency"
                },
                {
                    key: "STATE",
                    type: "custom",
                    templateUrl: "app/templates/labelStatus.html"
                },
                {
                    key: "datePaid"
                },
                {
                    key: "file",
                    type: "custom"
                },
            ];
        };


        model.getHeaders = function() {
            return [
                [

                    {
                        key: "Date",
                        text: "Date"
                    },
                    {
                        key: "RECORDNO",
                        text: "Invoice"
                    },
                    {
                        key: "LEASEID",
                        text: "Lease ID"
                    },
                    {
                        key: "UNITID",
                        text: "Unit ID"
                    },
                    {
                        key: "TOTALENTERED",
                        text: "Amount"
                    },
                    {
                        key: "STATE",
                        text: "Status"
                    },
                    {
                        key: "datePaid",
                        text: "datePaid"
                    },
                    {
                        key: "file",
                        text: "file"
                    }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "Date",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "RECORDNO",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "LEASEID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Lease ID"
                },
                {
                    key: "UNITID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Unit ID"
                },
                {
                    key: "TOTALENTERED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "STATE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by STATE"
                },
                {
                    key: "datePaid",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by datePaid"
                }

            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("sampleGrid1Config", ["rpGridConfig", Factory]);
})(angular);

//  Source: ui\home\account-payments\js\models\accounts-content.js
// Recall Distributed Allocations content
(function(angular) {
    'use strict';

    function factory(langTranslate) {
        var translate = langTranslate('Accounts').translate,
            model = {
                pageHeading: translate('accountsHeader'),
                pageComingSoon: translate('comingsoon')
            };
        return model;
    }
    angular.module("ui").
    factory('accountsContent', ['appLangTranslate', factory]);
})(angular);

//  Source: ui\home\account-payments\js\services\accountsSVC.js
(function() {
    'use strict';

    function Factory(http) {
        return {
            getAccountsInfo: function(obj) {
                return http.post('/api/accounts', obj);
            }
        };
    }
    angular
        .module('ui')
        .factory('accountsSvc', Factory);

    Factory.$inject = ['$http'];


})();


