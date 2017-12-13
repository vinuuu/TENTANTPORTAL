//  Source: ui\home\invoice\js\controllers\invoice.js
(function() {
    'use strict';


    function Controller(invoiceMdl, stateParams) {
        /* jshint validthis:true */
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = invoiceMdl.init();
        };
        vm.init();
    }
    angular
        .module('uam')
        .controller('invoiceCtrl', Controller);

    Controller.$inject = ['invoiceMdl', '$stateParams'];

})();

//  Source: ui\home\invoice\js\models\invoice.js
(function() {
    'use strict';

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc,
        langTranslate, invoiceSvc, _, gridPaginationModel,
        timeout, busyIndicatorModel, q, dashboardSvc, baseModel, stateParams) {
        var model = {},
            grid = gridModel(),
            busyIndicator,
            translate = langTranslate('viewpay').translate,
            gridPagination = gridPaginationModel(),
            gridTransform = gridTransformSvc();
        var gridPaginationConfig = {
            currentPage: 0,
            pagesPerGroup: 5,
            recordsPerPage: 6,
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
            return _.reduce(_.pluck(model.grid.data.records, 'TOTALPAYING'), function(memoizer, number) {
                return Number(memoizer || 0) + Number(number || 0);
            });
        };
        model.onPayAmount = function(val) {
            console.log(val);
            // model.TotalPaidAmountmethod();
        };
        model.init = function() {

            model.formConfig = formConfig;
            model.totalCount = 0;
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            formConfig.setMethodsSrc(model);
            gridConfig.setSrc(model);
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
            // model.loadData();
            model.loadData();

            return model;
        };

        model.translateNames = function(key) {
            return translate(key);
        };
        model.onPaymentTypeSelection = function(value) {
            console.log(value);
            //api call
            model.loadData();
        };
        model.onLeaseSelection = function(value) {
            //api call
            model.bindGrid(model.leasevalueID);
        };
        model.setData = function(data) {
            gridPagination.setData(data.records).goToPage({
                number: 0
            });
        };
        model.loadData = function(leaseid) {
            // var leaseid = leaseid === undefined ? '' : leaseid;
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
            // var inputObj = {
            //     "request": {
            //         "operation": {
            //             "content": {
            //                 "function": {
            //                     "readByQuery": {
            //                         "object": "pminvoice",
            //                         "fields": "",
            //                         "query": leaseidInput,
            //                         "returnFormat": "json"
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };

            q.all([invoiceSvc.getInvoiceList(baseModel.invoiceListInput(leaseid)),
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
                        model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                    });

                    formConfig.setOptions("leaseddl", model.leaseArray);
                    model.leasevalueID = '';

                    model.setData({ "records": data[0].data });
                }

            });

        };


        model.bindGrid = function(leaseid) {
            model.toggleGridState(true);

            // var inputObj = {
            //     "request": {
            //         "operation": {
            //             "content": {
            //                 "function": {
            //                     "readByQuery": {
            //                         "object": "pminvoice",
            //                         "fields": "",
            //                         "query": leaseidInput,
            //                         "returnFormat": "json"
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // };
            invoiceSvc.getInvoiceList(baseModel.invoiceListInput(leaseid)).then(function(response) {
                model.toggleGridState(false);
                model.totalCount = response.data.length;
                response.data.forEach(function(item) {
                    item.disableSelection = item.STATE === 'Paid' ? true : false;
                    model.setData({ "records": response.data });
                });
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
        'rpBusyIndicatorModel', '$q', 'dashboardSvc', 'baseModel', '$stateParams'
    ];

})();

//  Source: ui\home\invoice\js\services\invoice.js
(function() {
    'use strict';


    function factory($http) {

        return {
            getInvoiceList: function(obj) {
                return $http.post('/api/viewPay', obj);
            }
        };

    }

    angular
        .module('uam')
        .factory('invoiceSvc', factory);
    factory.$inject = ['$http'];
})();

//  Source: ui\home\invoice\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/invoice/templates/checkbox.html",
"");
$templateCache.put("home/invoice/templates/labelStatus.html",
"<div class=\"grid-edit-title\">dddd <span style=\"color:red\">haiiii</span></div>");
$templateCache.put("home/invoice/templates/textbox.html",
"<div class=\"grid-edit-title\"><rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\"></rp-form-input-text></div>");
}]);

//  Source: ui\home\invoice\js\models\gridModel.js
(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();


        model.get = function() {
            return [{
                    key: "isSelect",
                    type: "select",
                    idKey: "id"
                },
                {
                    key: "RECORDID",

                },
                {
                    key: "WHENCREATED"
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
                    key: "TOTALDUE",
                    type: "currency"
                },
                {
                    key: "TOTALPAYING",
                    type: "custom",
                    templateUrl: "app/templates/textbox.html",
                    onPayAmount: model.getMethod('onPayAmount'),
                },
                {
                    key: "STATE",
                    type: "custom",
                    templateUrl: "app/templates/label.html"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "isSelect",
                        type: "select",
                        enabled: false
                    },
                    {
                        key: "RECORDID",
                        text: "Invoice"
                    },
                    {
                        key: "WHENCREATED",
                        text: "Date"
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
                        key: "TOTALDUE",
                        text: "Amount Due"
                    },
                    {
                        key: "TOTALPAYING",
                        text: "Pay Amount"
                    },
                    {
                        key: "STATE",
                        text: "Status"
                    }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "isSelect",
                    value: "",
                    type: "menu",
                    options: [{
                            value: "",
                            name: "All"
                        },
                        {
                            value: true,
                            name: "Selected"
                        },
                        {
                            value: false,
                            name: "Not Selected"
                        }
                    ]
                }, {
                    key: "RECORDID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "WHENCREATED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
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
                    key: "TOTALDUE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount Due"
                },
                {
                    key: "TOTALPAYING",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Pay Amount"
                },
                {
                    key: "STATE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by STATE"
                }
            ];
        };
        model.getTrackSelectionConfig = function() {
            var config = {},
                columns = model.get();

            columns.forEach(function(column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };
        return model;
    }

    angular
        .module("ui")
        .factory("invoiceGrid1Config", ["rpGridConfig", Factory]);
})(angular);

//  Source: ui\home\invoice\js\models\selectConfig.js
(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig, inputConfig) {
        var model = baseFormConfig();

        model.paymentType = menuConfig({
            nameKey: "paymentTypeName",
            valueKey: "paymentTypeNameID",
            onChange: model.getMethod("onPaymentTypeSelection")
        });

        model.leaseddl = menuConfig({
            nameKey: "leaseName",
            valueKey: "leaseID",
            onChange: model.getMethod("onLeaseSelection")
        });
        model.payAmount = inputConfig({
            id: "Pay Amount",
            fieldName: "Pay Amount",
            onBlur: model.getMethod("onPayAmount")
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
        .factory("invoiceSelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig", "rpFormInputTextConfig",
            Factory
        ]);
})(angular);

