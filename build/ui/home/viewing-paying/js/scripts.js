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
                        "id": 1,
                        "Invoice": "2011/04/25",
                        "Date": "Invoice",
                        "Lease ID": "INV-000004-due on 02 Jun 2015",
                        "Unit ID": "11,000.00",
                        "Amount": "kkkk",
                        "Pay Amount": "hjhhhj",
                        "Status": "hjhhhj"
                    },
                    {
                        "id": 1,
                        "Invoice": "2011/04/25",
                        "Date": "Invoice",
                        "Lease ID": "INV-000004-due on 02 Jun 2015",
                        "Unit ID": "11,000.00",
                        "Amount": "kkkk",
                        "Pay Amount": "hjhhhj",
                        "Status": "hjhhhj"
                    },
                    {
                        "id": 1,
                        "Invoice": "2011/04/25",
                        "Date": "Invoice",
                        "Lease ID": "INV-000004-due on 02 Jun 2015",
                        "Unit ID": "11,000.00",
                        "Amount": "kkkk",
                        "Pay Amount": "hjhhhj",
                        "Status": "hjhhhj"
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };
        return model;
    }

    angular
        .module('ui')
        .factory('viewpayMdl', factory);
    factory.$inject = ['viewpaySelectMenuFormConfig', 'viewpayGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate"
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
                    key: "Lease ID"
                },
                {
                    key: "Unit ID"
                },
                {
                    key: "Amount"
                },
                {
                    key: "Pay Amount",
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
                        key: "Lease ID",
                        text: "Lease ID"
                    },
                    {
                        key: "Unit ID",
                        text: "Unit ID"
                    },
                    {
                        key: "Amount",
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
                    key: "Lease ID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Lease ID"
                },
                {
                    key: "Unit ID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Unit ID"
                },
                {
                    key: "Amount",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Amount"
                },
                {
                    key: "Pay Amount",
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

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
        });

        model.secondSelect = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
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

