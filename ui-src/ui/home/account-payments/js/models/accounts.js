//  Home Controller

(function() {
    "use strict";

    function AccountsMdl(accountsSvc, formConfig, gridConfig, gridModel, gridTransformSvc,
        dashboardSvc, baseModel, busyIndicatorModel, invoiceSvc, gridPaginationModel, moment, q,stateParams) {
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
            var options =  [{
                    accountHisrotyName: "All",
                    accountHisrotyNameID: ''
                },{
                    accountHisrotyName: "Current Month",
                    accountHisrotyNameID: moment().format("MM/01/YYYY")
                },
                {
                    accountHisrotyName: "Last 3 Months",
                    accountHisrotyNameID: moment().subtract(3, 'month').format('MM/DD/YYYY')
                },
                {
                    accountHisrotyName: "Last 6 Months",
                    accountHisrotyNameID: moment().subtract(6, 'month').format('MM/DD/YYYY')
                }
            ];

            formConfig
                .setOptions("accountHistory", options);

            model.accountHistoryType = "";
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());
            gridPagination
                .setConfig(gridPaginationConfig);
            model.gridPagination = gridPagination;
            grid.formConfig = formConfig;
            model.bindLeaseIDToDDl();
            return model;
        };


        model.onaccountHistorySelection = function(key) {
            model.getCustData({ leaseid: model.accountHistory, asofDate: model.accountHistoryType });
        };
        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.onleaseDataSelection = function(key) {
            model.getCustData({ leaseid: key, asofDate: moment(model.accountHistoryType) });

        };

        model.bindLeaseIDToDDl = function() {
            model.toggleGridState(true);           
            dashboardSvc.getLeaseList(baseModel.LeaseIDBinding()).catch(baseModel.error).then(function(response) {
                response.data.forEach(function(item) {
                    model.leaseArray.push({ accountHisrotyNameID: item.LEASEID, accountHisrotyName: item.LEASEID });
                });                
                model.leaseArray.push({ accountHisrotyNameID: '', accountHisrotyName: 'All' });                
                formConfig.setOptions("leaseData", model.leaseArray);
                model.accountHistory = stateParams.id!=="0"?stateParams.id:"";
                model.getCustData({ leaseid: model.accountHistory, asofDate: moment(model.accountHistoryType) });

            });

        };

        model.getCustData = function(data) {
            model.toggleGridState(true);

            q.all([accountsSvc.getAccountsInfo(baseModel.AccountsInput(data.leaseid)),
                invoiceSvc.getInvoiceList(baseModel.invoiceListWithDateInputNoLeaseIDinPayments(data.leaseid,model.accountHistoryType))
            ]).catch(baseModel.error).then(function(data) {
                model.toggleGridState(false);
                model.custData = data[0].data.api[0];
                model.custData.duedate = new Date(model.custData.duedate);
                model.custData.currentDate = moment().format('MMMM YYYY');
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
        '$q','$stateParams'
    ];
})(angular);