(function() {
    'use strict';

    function factory(dashboardSvc, $http, busyIndicatorModel, accountsSvc, moment, baseModel) {
        var model = {},
            busyIndicator,
            apiReady = false,
            response = {};

        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            model.cuurentmonth = moment().format('MMM YYYY');
            return model;
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


        model.getdashboardList = function() {
            model.toggleGridState(true);

            // var obj = {
            //     "request": {
            //         "operation": {
            //             "content": {
            //                 "function": {
            //                     "readByQuery": {
            //                         "object": "leaseoccupancy",
            //                         "fields": "",
            //                         "query": "",
            //                         "returnFormat": "json"
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };
            dashboardSvc.getLeaseList(baseModel.LeaseIDBinding()).then(function(response) {
                if (response.data && response.data.length > 0) {
                    model.tenantlist = response.data;
                    model.bindleaseDetailsData(model.tenantlist[0]);
                }
            });

        };

        model.bindleaseDetailsData = function(item) {
            model.toggleGridState(true);
            // var obj = {
            //     "request": {
            //         "operation": {
            //             "content": {
            //                 "function": {
            //                     "getTenantBalance": {
            //                         "leaseid": item.LEASEID,
            //                         "asofdate": {
            //                             "year": moment().year(),
            //                             "month": (moment().month() + 1),
            //                             "day": moment().day()
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };
            accountsSvc.getAccountsInfo(baseModel.AccountsInput(item.LEASEID)).then(function(response) {
                model.toggleGridState(false);
                if (response.data) {
                    item.leaseDetailsData = model.custData = response.data.api[0];
                }
            });
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };
        return model.init();
    }
    angular
        .module('ui')
        .factory('dashboardMdl', factory);

    factory.$inject = ['dashboardSvc', '$http', 'rpBusyIndicatorModel', 'accountsSvc', 'moment', 'baseModel'];
})();