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
        .module('uam')
        .factory('viewpayMdl', factory);
    factory.$inject = ['viewpaySelectMenuFormConfig', 'viewpayGrid1Config', "rpGridModel",
        "rpGridTransform", "appLangTranslate"
    ];

})();