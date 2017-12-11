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
                    model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                });
                // timeout(function() {
                formConfig.setOptions("leaseIdList", model.leaseArray);
                model.leaseId = stateParams.id;
                // }, 1000);

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
                                    "leaseid": model.leaseId,
                                    "fromdate": {
                                        "year": moment(model.dateRange).year(),
                                        "month": moment(model.dateRange).month() + 1,
                                        "day": "01"
                                    },
                                    "todate": {
                                        "year": moment().format('YYYY'),
                                        "month": moment().month() + 1,
                                        "day": moment().format('DD')
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