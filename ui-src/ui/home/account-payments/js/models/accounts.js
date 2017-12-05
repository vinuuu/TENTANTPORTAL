//  Home Controller

(function() {
    "use strict";

    function AccountsMdl(accountsSvc, formConfig, gridConfig, gridModel, gridTransformSvc) {
        var model = {},

            // translate = langTranslate('error').translate,
            grid = gridModel(),
            gridTransform = gridTransformSvc();
        model.response = {};
        model.init = function() {
            model.mockData();
            model.formConfig = formConfig;

            formConfig.setMethodsSrc(model);
            var options = [{
                    accountHisrotyName: "Current Month",
                    accountHisrotyNameID: "0"
                },
                {
                    accountHisrotyName: "last 3 Month",
                    accountHisrotyNameID: "01"
                },
                {
                    accountHisrotyName: "last 6 Month",
                    accountHisrotyNameID: "02"
                }
            ];

            formConfig
                .setOptions("accountHistory", options);
            formConfig.setOptions("leaseData", options);

            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            model.loadData();
            return model;
        };
        // model.translateNames = function(key) {
        //     return translate(key);
        // };
        model.mockData = function() {
            model.custData = {
                tenantName: 'Kim Resident',
                leaseTerm: '1/1/2016-12/31/2018',
                PrevoiusStatement: 'XXXXXXXXXXXXXXXX',
                PreviousBalance: '$27,885.14',
                lastPayment: '$27,885.16',
                lastPaymentReceivedOn: '1/1/2016',
                currentStatement: 'XXXXXXXXXXXX',
                currentBalance: '$27,885.14',
                dueDate: '2/1/2016'
            };
            model.accountHistory = "01";
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };

        model.getCustData = function() {
            // accountsSvc.getcustData().then(function() {

            // }).catch(function() {
            model.mockData();
            // });
        };

        model.loadData = function() {
            grid.setData({
                "records": [{
                        "id": 1,
                        "name": "Tiger Nixon",
                        "title": "System Architect",
                        "location": "Edinburgh",
                        "extn": "5421",
                        "startDate": "2011/04/25",
                        "salary": 320800,
                        "isRemote": false
                    },
                    {
                        "id": 49,
                        "name": "Zorita Serrano",
                        "title": "Software Engineer",
                        "location": "San Francisco",
                        "extn": "4389",
                        "startDate": "2012/06/01",
                        "salary": 115000,
                        "isRemote": false
                    },
                    {
                        "id": 50,
                        "name": "Jennifer Acosta",
                        "title": "Junior Javascript Developer",
                        "location": "Edinburgh",
                        "extn": "3431",
                        "startDate": "2013/02/01",
                        "salary": 75650,
                        "isRemote": false
                    },
                    {
                        "id": 51,
                        "name": "Cara Stevens",
                        "title": "Sales Assistant",
                        "location": "New York",
                        "extn": "3990",
                        "startDate": "2011/12/06",
                        "salary": 145600,
                        "isRemote": false
                    },
                    {
                        "id": 52,
                        "name": "Hermione Butler",
                        "title": "Regional Director",
                        "location": "London",
                        "extn": "1016",
                        "startDate": "2011/03/21",
                        "salary": 356250,
                        "isRemote": false
                    },
                    {
                        "id": 53,
                        "name": "Lael Greer",
                        "title": "Systems Administrator",
                        "location": "London",
                        "extn": "6733",
                        "startDate": "2009/02/27",
                        "salary": 103500,
                        "isRemote": false
                    },
                    {
                        "id": 54,
                        "name": "Jonas Alexander",
                        "title": "Developer",
                        "location": "San Francisco",
                        "extn": "8196",
                        "startDate": "2010/07/14",
                        "salary": 86500,
                        "isRemote": false
                    },
                    {
                        "id": 55,
                        "name": "Shad Decker",
                        "title": "Regional Director",
                        "location": "Edinburgh",
                        "extn": "6373",
                        "startDate": "2008/11/13",
                        "salary": 183000,
                        "isRemote": false
                    },
                    {
                        "id": 56,
                        "name": "Michael Bruce",
                        "title": "Javascript Developer",
                        "location": "Singapore",
                        "extn": "5384",
                        "startDate": "2011/06/27",
                        "salary": 183000,
                        "isRemote": false
                    },
                    {
                        "id": 57,
                        "name": "Donna Snider",
                        "title": "Customer Support",
                        "location": "New York",
                        "extn": "4226",
                        "startDate": "2011/01/25",
                        "salary": 112000,
                        "isRemote": false
                    }
                ]
            });
            //  vm.dataReq = dataSvc.get(grid.setData.bind(grid));
        };

        return model;
    }

    angular
        .module("ui")
        .factory("accountsMdl", AccountsMdl);
    AccountsMdl.$inject = ['accountsSvc', 'sampleSelectMenuFormConfig', "sampleGrid1Config",
        "rpGridModel",
        "rpGridTransform"
    ];
})(angular);