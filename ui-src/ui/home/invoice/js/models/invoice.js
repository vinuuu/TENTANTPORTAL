(function() {
    'use strict';

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc,
        langTranslate, invoiceSvc, _, gridPaginationModel,
        timeout, busyIndicatorModel, q, dashboardSvc, baseModel, stateParams,moment) {
        var model = {},
            grid = gridModel(),
            busyIndicator,
            translate = langTranslate('viewpay').translate,
            gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        var gridPaginationConfig = {
            currentPage: 1,
            pagesPerGroup: 5,
            recordsPerPage: 20,
            currentPageGroup: 0
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
        model.invoicesCount = function() {
            var tot = model.getSelectedList();
            return tot.length;
        };
        model.getSelectedList = function() {
            return _.where(model.grid.data.records, { isSelect: true });
        };

        model.TotalPaidAmount = function() {
            return _.reduce(_.pluck(_.where(model.grid.data.records, { isSelect: true }), 'TOTALPAYING'), function(memoizer, number) {
                return Number(memoizer || 0) + Number(number || 0);
            });
        };
        model.onPayAmount = function(record) {
            record.isSelect = Number(record.TOTALPAYING) > 0 ? true : false;
            model.TotalPaidAmount();
        };
        model.init = function() {

            model.formConfig = formConfig;
            model.totalCount = 0;
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            formConfig.setMethodsSrc(model);

            var options = [{
                    paymentTypeName: "All Transactions",
                    paymentTypeNameID: ""
                },
                {
                    paymentTypeName: "Paid",
                    paymentTypeNameID: "Paid"
                },
                {
                    paymentTypeName: "Due for payment",
                    paymentTypeNameID: "Due for payment"
                }
            ];
            var optionsDate = [{
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
            .setOptions("accountHistory", optionsDate);

            model.accountHistoryType = '';
            model.accountHistoryType = stateParams.m === "1" ? moment().format("MM/01/YYYY"):'';
            formConfig.setOptions("paymentType", options);
            model.paymenttype = '';
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());
            gridPagination
                .setConfig(gridPaginationConfig);
            model.gridPagination = gridPagination;
            grid.formConfig = formConfig;
            model.leasevalueID=stateParams.id!=="0"?stateParams.id:"";
            model.loadData();

            return model;
        };

        model.translateNames = function(key) {
            return translate(key);
        };
        model.onPaymentTypeSelection = function(value) {
            model.bindGrid();
        };
        model.onLeaseSelection = function(value) {
            //api call
            model.bindGrid();
        };
        model.onaccountHistorySelection = function(key) {
            model.bindGrid({ leaseid: model.accountHistory, asofDate: model.accountHistoryType });
        };
        model.setData = function(data) {
            gridPagination.setData(data.records).goToPage({
                number: 0
            });
        };
        model.loadData = function() {
            // var leaseid = leaseid === undefined ? '' : leaseid;
            model.toggleGridState(true);

            q.all([invoiceSvc.getInvoiceList(baseModel.invoiceListTransactionInput(model.leasevalueID, model.paymenttype,model.accountHistoryType)),
                dashboardSvc.getLeaseList(baseModel.LeaseIDBinding())
            ]).catch(baseModel.error).then(function(data) {
                model.toggleGridState(false);
                if (data && data.length > 0) {
                    model.totalCount = data[0].data.length;
                    model.leaseArray = [];
                    model.leaseArray.push({ leaseID: '', leaseName: 'All' });
                    data[0].data.forEach(function(item) {
                        item.disableSelection = item.STATE === 'Paid' ? true : false;
                    });
                    model.leaseArray.push({ leaseID: '', leaseName: 'All' });
                    data[1].data.forEach(function(item) {
                        model.leaseArray.push({ leaseID: item.LEASEID, leaseName: item.LEASEID });
                    });

                    formConfig.setOptions("leaseddl", model.leaseArray);
                    model.setData({ "records": data[0].data });
                }

            });

        };


        model.bindGrid = function() {
            model.toggleGridState(true);

            invoiceSvc.getInvoiceList(baseModel.invoiceListTransactionInput(model.leasevalueID, model.paymenttype,model.accountHistoryType)).then(function(response) {
                model.toggleGridState(false);
                model.totalCount = response.data.length;
                response.data.forEach(function(item) {
                    item.disableSelection = item.STATE === 'Paid' ? true : false;
                });
                model.setData({ "records": response.data });
            }).catch(function(ex) {
                model.toggleGridState(false);
            });
        };

        return model;
    }

    angular
        .module('ui')
        .factory('invoiceMdl', factory);
    factory.$inject = ['invoiceSelectMenuFormConfig', 'invoiceGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate", "invoiceSvc", 'underscore',
        'rpGridPaginationModel', '$timeout',
        'rpBusyIndicatorModel', '$q', 'dashboardSvc', 'baseModel', '$stateParams','moment'
    ];

})();