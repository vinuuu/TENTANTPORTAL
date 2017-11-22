//  Source: ui\home\viewing-paying\js\controllers\viewPay.js
(function() {
    'use strict';




    function controller(viewpayMdl) {
        /* jshint validthis:true */
        var vm = this,
            model;


        vm.init = function() {
            vm.model = model = viewpayMdl.init();
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
                    key: "LEASEID"
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
"<div class=\"grid-edit-title\"><rp-form-input-text config=\"model.formConfig.lease\" rp-model=\"record[config.key]\"></rp-form-input-text></div>");
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

