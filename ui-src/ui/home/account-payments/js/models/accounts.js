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
                model.custData.duedate = new Date(model.custData.duedate);
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