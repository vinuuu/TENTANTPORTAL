(function() {
    'use strict';

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc, langTranslate, invoiceSvc, _, gridPaginationModel, timeout) {
        var model = {},
            grid = gridModel(),
            translate = langTranslate('viewpay').translate,
            gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        var gridPaginationConfig = {
            currentPage: 0,
            pagesPerGroup: 5,
            recordsPerPage: 10,
            currentPageGroup: 0
        };


        model.init = function() {

            model.formConfig = formConfig;
            formConfig.setMethodsSrc(model);
            var options = [{
                    paymentTypeName: "All Transaction",
                    paymentTypeNameID: "All Transaction"
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

            formConfig.setOptions("paymentType", options);
            model.paymenttype = 'All Transaction';
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
        model.translateNames = function(key) {
            return translate(key);
        };
        model.onPaymentTypeSelection = function(value) {
            //api call
            model.loadData();
        };
        model.onLeaseSelection = function(value) {
            //api call
            model.loadData();
        };
        model.setData = function(data) {
            gridPagination.setData(data.records).goToPage({
                number: 0
            });
        };
        model.loadData = function() {

            var inputObj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "pminvoice",
                                    "fields": "",
                                    "query": "",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };

            invoiceSvc.getInvoiceList(inputObj).then(function(response) {
                if (response.data && response.data.length > 0) {
                    model.leaseArray = [];
                    model.leaseArray.push({ leaseID: '', leaseName: 'All' });
                    response.data.forEach(function(item) {
                        item.disableSelection = item.STATE === 'Paid' ? true : false;
                        model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                    });

                    timeout(function() {
                        formConfig.setOptions("leaseddl", model.leaseArray);
                        model.leasevalueID = '';
                    }, 500);

                    model.setData({ "records": response.data });
                }
            });


        };
        return model;
    }

    angular
        .module('ui')
        .factory('invoiceMdl', factory);
    factory.$inject = ['invoiceSelectMenuFormConfig', 'invoiceGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate", "invoiceSvc", 'underscore', 'rpGridPaginationModel', '$timeout'
    ];

})();