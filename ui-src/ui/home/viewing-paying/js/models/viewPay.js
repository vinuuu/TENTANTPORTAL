(function() {
    'use strict';

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc, langTranslate, viewPaySvc, _, timeout) {
        var model = {},
            grid = gridModel(),
            translate = langTranslate('viewpay').translate,
            gridTransform = gridTransformSvc();
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
            grid.formConfig = formConfig;
            model.loadData();
            return model;
        };
        model.translateNames = function(key) {
            return translate(key);
        };


        model.loadData = function() {
            // grid.setData({
            //     "records": [{
            //             "id": 1,
            //             "Invoice": "2011/04/25",
            //             "Date": "Invoice",
            //             "Lease ID": "INV-000004-due on 02 Jun 2015",
            //             "Unit ID": "11,000.00",
            //             "Amount": "kkkk",
            //             "Pay Amount": "hjhhhj",
            //             "Status": "hjhhhj"
            //         },
            //         {
            //             "id": 1,
            //             "Invoice": "2011/04/25",
            //             "Date": "Invoice",
            //             "Lease ID": "INV-000004-due on 02 Jun 2015",
            //             "Unit ID": "11,000.00",
            //             "Amount": "kkkk",
            //             "Pay Amount": "hjhhhj",
            //             "Status": "hjhhhj"
            //         },
            //         {
            //             "id": 1,
            //             "Invoice": "2011/04/25",
            //             "Date": "Invoice",
            //             "Lease ID": "INV-000004-due on 02 Jun 2015",
            //             "Unit ID": "11,000.00",
            //             "Amount": "kkkk",
            //             "Pay Amount": "hjhhhj",
            //             "Status": "hjhhhj"
            //         }
            //     ]
            // });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));

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

            //u can use _ now
            viewPaySvc.getInvoiceList(inputObj).then(function(response) {
                if (response.data && response.data.length > 0) {
                    model.leaseArray = [];

                    response.data.forEach(function(item) {
                        model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                    });

                    timeout(function() {
                        formConfig.setOptions("secondSelect", model.leaseArray);
                        model.leasevalueID = model.leaseArray[0].leaseID;
                    }, 500);

                    grid.setData({ "records": response.data });
                }
            });


        };
        return model;
    }

    angular
        .module('ui')
        .factory('viewpayMdl', factory);
    factory.$inject = ['viewpaySelectMenuFormConfig', 'viewpayGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate", "viewPaySvc", 'underscore', '$timeout'
    ];

})();