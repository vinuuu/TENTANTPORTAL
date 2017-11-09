//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsMdl(gridConfig, gridModel, gridTransformSvc) {
        var model = {},
            response = {},
            grid = gridModel(),
            gridTransform = gridTransformSvc();
        model.init = function() {
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            model.loadData();
            return model;
        };
        model.mockData = function() {

            model.bindtenantdata(response);
        };
        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.loadData = function() {
            grid.setData({
                "records": [{
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "kkkk",
                        "Balance": "hjhhhj"
                    },
                    {
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "jjjj",
                        "Balance": "11,000.00"
                    },
                    {
                        "id": 1,
                        "Date": "2011/04/25",
                        "Transactions": "Invoice",
                        "Details": "INV-000004-due on 02 Jun 2015",
                        "Amount": "11,000.00",
                        "Payments": "bbb",
                        "Balance": "11,000.00"
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };


        return model;
    }

    angular
        .module("uam")
        .factory("statementsdMdl", ["staementGrid1Config",
            "rpGridModel",
            "rpGridTransform", StatementsMdl
        ]);
})(angular);