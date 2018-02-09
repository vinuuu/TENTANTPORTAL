(function() {
    'use strict';

    function factory(dashboardSvc, $http, busyIndicatorModel, accountsSvc, moment, baseModel, storage) {
        var model = {},
            busyIndicator,
            apiReady = false,
            response = {};

        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            model.cuurentmonth = moment().format('MMM YYYY');
            model.permissions = storage.get('permissionsFormenu');
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
            dashboardSvc.getLeaseList(baseModel.LeaseIDBinding()).then(function(response) {
                if (response.data && response.data.length > 0) {
                    model.tenantlist = response.data;
                    model.bindleaseDetailsData(model.tenantlist[0]);
                }
            });

        };

        model.bindleaseDetailsData = function(item) {
            model.selectedLease = item.LEASEID;
            model.toggleGridState(true);
            accountsSvc.getAccountsInfo(baseModel.AccountsInput(item.LEASEID)).then(function(response) {
                model.toggleGridState(false);
                if (response.data) {
                    model.leaseDetailsData = model.custData = response.data.api[0];
                    model.leaseDetailsData.leaseID = item.LEASEID;
                    model.leaseDetailsData.roundPercentage = Math.round(model.leaseDetailsData.percentage);
                    model.getpercentage = { "width": Math.round(model.leaseDetailsData.percentage) + "%" };
                    //model.leaseDetailsData.percentage+"px"};
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

    factory.$inject = ['dashboardSvc', '$http', 'rpBusyIndicatorModel', 'accountsSvc', 'moment', 'baseModel', 'rpSessionStorage'];
})();