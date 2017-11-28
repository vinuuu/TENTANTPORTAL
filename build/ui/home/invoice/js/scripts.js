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

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc, langTranslate) {
        var model = {},
            grid = gridModel(),
            translate = langTranslate('viewpay').translate,
            gridTransform = gridTransformSvc();
        model.init = function() {

            model.formConfig = formConfig;
            formConfig.setMethodsSrc(model);
            var options = [{
                    accountHisrotyName: "Show all trnsactions",
                    accountHisrotyNameID: "0"
                },
                {
                    accountHisrotyName: "Lease ID : 123457",
                    accountHisrotyNameID: "01"
                },
                {
                    accountHisrotyName: "Lease ID : 123458",
                    accountHisrotyNameID: "02"
                }
            ];
            var options1 = [{
                    accountHisrotyName: "Lease ID : 123456",
                    accountHisrotyNameID: "0"
                },
                {
                    accountHisrotyName: "Lease ID : 123457",
                    accountHisrotyNameID: "01"
                },
                {
                    accountHisrotyName: "Lease ID : 123458",
                    accountHisrotyNameID: "02"
                }
            ];

            formConfig.setOptions("accountHistory", options);
            formConfig.setOptions("secondSelect", options1);

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
            grid.setData({
                "records": [{
                        "CUSTOMERID": "Sri_lease1",
                        "LEASEID": "AH-1038",
                        "RECORDID": "ssss",
                        "RECORDNO": "26834",
                        "STATE": "Posted",
                        "TOTALDUE": "1200",
                        "Pay Amount": "1200",
                        "UNITID": "U1"
                    },
                    {
                        "CUSTOMERID": "Sri_lease1",
                        "LEASEID": "AH-1038",
                        "RECORDID": "ssss",
                        "RECORDNO": "26834",
                        "STATE": "Posted",
                        "TOTALDUE": "1200",
                        "Pay Amount": "1200",
                        "UNITID": "U1"
                    },
                    {
                        "CUSTOMERID": "Sri_lease1",
                        "LEASEID": "AH-1038",
                        "RECORDID": "ssss",
                        "RECORDNO": "26834",
                        "STATE": "Posted",
                        "TOTALDUE": "1200",
                        "Pay Amount": "1200",
                        "UNITID": "U1"
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };
        return model;
    }

    angular
        .module('uam')
        .factory('invoiceMdl', factory);
    factory.$inject = ['viewpaySelectMenuFormConfig', 'viewpayGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate"
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
                    key: "TOTALDUE"
                },
                {
                    key: "Pay Amount",
                    type: "custom",
                    templateUrl: "home/invoice/templates/textbox.html"
                },
                {
                    key: "Status"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
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
                        text: "Amount"
                    },
                    {
                        key: "Pay Amount",
                        text: "Pay Amount"
                    },
                    {
                        key: "Status",
                        text: "Status"
                    }
                ]
            ];
        };


        model.getFilters = function() {
            return [{
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
        .factory("viewpayGrid1Config", ["rpGridConfig", Factory]);
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
        .factory("viewpaySelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig", "rpFormInputTextConfig",
            Factory
        ]);
})(angular);

