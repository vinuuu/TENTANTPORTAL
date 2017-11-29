//  Source: ui\home\viewing-paying\js\controllers\viewPay.js
(function() {
    'use strict';




    function controller(viewpayMdl) {
        /* jshint validthis:true */
        var vm = this,
            model;


        vm.init = function() {
            vm.model = model = viewpayMdl;
        };
        vm.init();
    }
    angular
        .module('ui')
        .controller('viewpayCtrl', controller);
    controller.$inject = ['viewpayMdl'];

})();

//  Source: ui\home\viewing-paying\js\models\viewPay.js
(function() {
    'use strict';

    function factory(formConfig, gridConfig, gridModel, gridTransformSvc, langTranslate, viewPaySvc, _, gridPaginationModel, timeout) {
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
            grid.setConfig(gridConfig);
            gridPagination.setGrid(grid); //.trackSelection(gridConfig.getTrackSelectionConfig());
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
            var d = [{
                CUSTOMERID: "Sri_lease1",
                LEASEID: "AH-1038",
                RECORDID: null,
                RECORDNO: "26834",
                STATE: "Posted",
                TOTALDUE: "1200",
                TOTALENTERED: "1200",
                UNITID: "U1"
            }];
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

                    model.setData({ "records": response.data });
                }
            });


        };
        return model.init();
    }

    angular
        .module('ui')
        .factory('viewpayMdl', factory);
    factory.$inject = ['viewpaySelectMenuFormConfig', 'viewpayGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate", "viewPaySvc", 'underscore', 'rpGridPaginationModel', '$timeout'
    ];

})();

//  Source: ui\home\viewing-paying\js\models\gridModel.js
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
                    key: "LEASEID",
                    type: "custom",
                    templateUrl: "home/base/templates/textbox.html"
                },
                {
                    key: "UNITID"
                },
                {
                    key: "TOTALDUE"
                },
                {
                    key: "TOTALENTERED",
                    type: "custom",
                    templateUrl: "home/viewing-paying/templates/textbox.html"
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
                        key: "TOTALENTERED",
                        text: "Amount"
                    },
                    {
                        key: "TOTALENTERED",
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

//  Source: ui\home\viewing-paying\js\models\selectConfig.js
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
            id: "Invoice",
            fieldName: "Invoice"
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

//  Source: ui\home\viewing-paying\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/viewing-paying/templates/checkbox.html",
"");
$templateCache.put("home/viewing-paying/templates/textbox.html",
"<div class=\"grid-edit-title\">{{record[config.key]}}<!-- <rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\">\n" +
"    </rp-form-input-text> --></div>");
}]);

//  Source: ui\home\viewing-paying\js\services\viewPaySvc.js
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
        .module('ui')
        .factory('viewPaySvc', factory);

    factory.$inject = ['$http'];

})();

