//  Source: ui\home\invoice\js\controllers\invoice.js
(function() {
    'use strict';


    function Controller(invoiceMdl) {
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

    Controller.$inject = ['invoiceMdl'];

})();

//  Source: ui\home\invoice\js\models\invoice.js
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

                    response.data.forEach(function(item) {
                        model.leaseArray.push({ leaseID: item.LEASEID, leaseName: 'LeaseID :' + item.LEASEID });
                    });

                    timeout(function() {
                        formConfig.setOptions("secondSelect", model.leaseArray);
                        model.leasevalueID = model.leaseArray[0].leaseID;
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
                    key: "Invoice",

                },
                {
                    key: "Date"
                },
                {
                    key: "LEASEID"

                },
                {
                    key: "UNITID"
                },
                {
                    key: "TOTALENTERED"
                },
                {
                    key: "Pay Amount",
                    type: "custom",
                    templateUrl: "app/templates/textbox.html"
                },
                {
                    key: "Status"
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
                        key: "Invoice",
                        text: "Invoice"
                    },
                    {
                        key: "Date",
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
                        key: "TOTALDUE",
                        text: "TOTALENTERED"
                    },
                    {
                        key: "Pay Amount",
                        text: "PayAmount"
                    },
                    {
                        key: "Status",
                        text: "STATE"
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
                            name: "Remote"
                        },
                        {
                            value: false,
                            name: "Local"
                        }
                    ]
                }, {
                    key: "Invoice",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "Date",
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
                    key: "TOTALDUE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Amount"
                },
                {
                    key: "TOTALENTERED",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Pay Amount"
                },
                {
                    key: "Status",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Status"
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
            valueKey: "paymentTypeNameID"
        });

        model.secondSelect = menuConfig({
            nameKey: "leaseName",
            valueKey: "leaseID"
        });
        model.lease = inputConfig({
            id: "Pay Amount",
            fieldName: "Pay Amount"
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

