//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsMdl(gridConfig, gridModel, gridTransformSvc, formConfig, q, baseModel, busyIndicatorModel, statementSvc,
        dashboardSvc, timeout, stateParams, gridPaginationModel) {
        var model = {},
            busyIndicator,
            response = {},
            grid = gridModel(),
            gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        var gridPaginationConfig = {
            currentPage: 0,
            pagesPerGroup: 5,
            recordsPerPage: 6,
            currentPageGroup: 0
        };
        model.statementData = {};
        model.formConfig = formConfig;
        model.leaseArray = [];
        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());
            gridPagination
                .setConfig(gridPaginationConfig);
            model.gridPagination = gridPagination;
            grid.formConfig = formConfig;

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
            formConfig.setMethodsSrc(model);

            var DateRangeoptions = [{
                    dateRangeName: "This Year",
                    dateRangeID: "01"
                },
                {
                    dateRangeName: "Past 6 Months",
                    dateRangeID: "02"
                },
                {
                    dateRangeName: "Past 3 Months",
                    dateRangeID: "03"
                },
                {
                    dateRangeName: "Current Month",
                    dateRangeID: "04"
                },
                {
                    dateRangeName: "Prior Month",
                    dateRangeID: "05"
                }
            ];

            formConfig.setOptions("dateRange", DateRangeoptions);
            model.dateRange = "01";

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
                model.leaseArray.push({ leaseID: '', leaseName: 'All' });
                response.data.forEach(function(item) {
                    model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                });
                timeout(function() {
                    formConfig.setOptions("leaseIdList", model.leaseArray);
                    model.leaseId = stateParams.id;
                }, 1000);

                model.toggleGridState(false);
                model.getStatement();

            });
        };

        model.getStatement = function() {
            model.toggleGridState(true);
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "getTenantStatement": {
                                    // "leaseid": "AH-1038",
                                    "leaseid": stateParams.id,
                                    "fromdate": {
                                        "year": "2015",
                                        "month": "01",
                                        "day": "01"
                                    },
                                    "todate": {
                                        "year": "2018",
                                        "month": "01",
                                        "day": "01"
                                    }
                                }
                            }
                        }
                    }
                }
            };
            statementSvc.getStatementList(obj).catch(baseModel.error).then(function(response) {
                model.toggleGridState(false);
                if (response.data.api) {
                    model.statementData = response.data.api[0];
                    model.setData({
                        "records": model.statementData.payinfo
                    });
                } else {

                }
            });

        };
        model.setData = function(data) {
            gridPagination.setData(data.records).goToPage({
                number: 0
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

        model.onLeaseIdChange = function(value) {
            model.callingDummyApi();
        };

        model.onDataRange = function(value) {
            model.callingDummyApi();
        };

        model.callingDummyApi = function() {

            model.toggleGridState(true);
            //dummy api call
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
                model.toggleGridState(false);
            }).catch(function(ex) {
                model.toggleGridState(false);
            });
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("statementsdMdl", ["staementGrid1Config", "rpGridModel", "rpGridTransform", "statementConfig", '$q',
            'baseModel', 'rpBusyIndicatorModel', 'statementSvc', 'dashboardSvc', '$timeout', '$stateParams', 'rpGridPaginationModel',
            StatementsMdl
        ]);
})(angular);