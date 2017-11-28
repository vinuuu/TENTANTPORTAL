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