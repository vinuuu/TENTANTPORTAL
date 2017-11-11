//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl, formConfig, gridConfig, gridModel, gridTransformSvc, accountsContent) {
        var vm = this,
            model,
            content = accountsContent,
            grid = gridModel(),
            gridTransform = gridTransformSvc();
        // vm.translateNames = function(key) {
        //     return translate(key);
        // // };
        vm.init = function() {
            vm.model = model = accountsMdl;
            vm.content = content;
            vm.formConfig = formConfig;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.getCustData();

            formConfig.setMethodsSrc(vm);
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


            vm.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            vm.loadData();
        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };


        vm.loadData = function() {
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
                        "id": 2,
                        "name": "Garrett Winters",
                        "title": "Accountant",
                        "location": "Tokyo",
                        "extn": "8422",
                        "startDate": "2011/07/25",
                        "salary": 170750,
                        "isRemote": false,
                        "disableSelection": true
                    },
                    {
                        "id": 3,
                        "name": "Ashton Cox",
                        "title": "Junior Technical Author",
                        "location": "San Francisco",
                        "extn": "1562",
                        "startDate": "2009/01/12",
                        "salary": 86000,
                        "isRemote": false,
                        "disableSelection": true
                    },
                    {
                        "id": 4,
                        "name": "Cedric Kelly",
                        "title": "Senior Javascript Developer",
                        "location": "Edinburgh",
                        "extn": "6224",
                        "startDate": "2012/03/29",
                        "salary": 433060,
                        "isRemote": false,
                        "disableSelection": true
                    },
                    {
                        "id": 5,
                        "name": "Airi Satou",
                        "title": "Accountant",
                        "location": "Tokyo",
                        "extn": "5407",
                        "startDate": "2008/11/28",
                        "salary": 162700,
                        "isRemote": false,
                        "disableSelection": true
                    },
                    {
                        "id": 6,
                        "name": "Brielle Williamson",
                        "title": "Integration Specialist",
                        "location": "New York",
                        "extn": "4804",
                        "startDate": "2012/12/02",
                        "salary": 372000,
                        "isRemote": false
                    },
                    {
                        "id": 7,
                        "name": "Herrod Chandler",
                        "title": "Sales Assistant",
                        "location": "San Francisco",
                        "extn": "9608",
                        "startDate": "2012/08/06",
                        "salary": 137500,
                        "isRemote": false
                    },
                    {
                        "id": 8,
                        "name": "Rhona Davidson",
                        "title": "Integration Specialist",
                        "location": "Tokyo",
                        "extn": "6200",
                        "startDate": "2010/10/14",
                        "salary": 327900,
                        "isRemote": true
                    },
                    {
                        "id": 9,
                        "name": "Colleen Hurst",
                        "title": "Javascript Developer",
                        "location": "San Francisco",
                        "extn": "2360",
                        "startDate": "2009/09/15",
                        "salary": 205500,
                        "isRemote": true
                    },
                    {
                        "id": 10,
                        "name": "Sonya Frost",
                        "title": "Software Engineer",
                        "location": "Edinburgh",
                        "extn": "1667",
                        "startDate": "2008/12/13",
                        "salary": 103600,
                        "isRemote": false
                    },
                    {
                        "id": 11,
                        "name": "Jena Gaines",
                        "title": "Office Manager",
                        "location": "London",
                        "extn": "3814",
                        "startDate": "2008/12/19",
                        "salary": 90560,
                        "isRemote": false
                    },
                    {
                        "id": 12,
                        "name": "Quinn Flynn",
                        "title": "Support Lead",
                        "location": "Edinburgh",
                        "extn": "9497",
                        "startDate": "2013/03/03",
                        "salary": 342000,
                        "isRemote": false
                    },
                    {
                        "id": 13,
                        "name": "Charde Marshall",
                        "title": "Regional Director",
                        "location": "San Francisco",
                        "extn": "6741",
                        "startDate": "2008/10/16",
                        "salary": 470600,
                        "isRemote": false
                    },
                    {
                        "id": 14,
                        "name": "Haley Kennedy",
                        "title": "Senior Marketing Designer",
                        "location": "London",
                        "extn": "3597",
                        "startDate": "2012/12/18",
                        "salary": 313500,
                        "isRemote": false
                    },
                    {
                        "id": 15,
                        "name": "Tatyana Fitzpatrick",
                        "title": "Regional Director",
                        "location": "London",
                        "extn": "1965",
                        "startDate": "2010/03/17",
                        "salary": 385750,
                        "isRemote": false
                    },
                    {
                        "id": 16,
                        "name": "Michael Silva",
                        "title": "Marketing Designer",
                        "location": "London",
                        "extn": "1581",
                        "startDate": "2012/11/27",
                        "salary": 198500,
                        "isRemote": false
                    },
                    {
                        "id": 17,
                        "name": "Paul Byrd",
                        "title": "Chief Financial Officer (CFO)",
                        "location": "New York",
                        "extn": "3059",
                        "startDate": "2010/06/09",
                        "salary": 725000,
                        "isRemote": false
                    },
                    {
                        "id": 18,
                        "name": "Gloria Little",
                        "title": "Systems Administrator",
                        "location": "New York",
                        "extn": "1721",
                        "startDate": "2009/04/10",
                        "salary": 237500,
                        "isRemote": false
                    },
                    {
                        "id": 19,
                        "name": "Bradley Greer",
                        "title": "Software Engineer",
                        "location": "London",
                        "extn": "2558",
                        "startDate": "2012/10/13",
                        "salary": 132000,
                        "isRemote": false
                    },
                    {
                        "id": 20,
                        "name": "Dai Rios",
                        "title": "Personnel Lead",
                        "location": "Edinburgh",
                        "extn": "2290",
                        "startDate": "2012/09/26",
                        "salary": 217500,
                        "isRemote": false
                    },
                    {
                        "id": 21,
                        "name": "Jenette Caldwell",
                        "title": "Development Lead",
                        "location": "New York",
                        "extn": "1937",
                        "startDate": "2011/09/03",
                        "salary": 345000,
                        "isRemote": false
                    },
                    {
                        "id": 22,
                        "name": "Yuri Berry",
                        "title": "Chief Marketing Officer (CMO)",
                        "location": "New York",
                        "extn": "6154",
                        "startDate": "2009/06/25",
                        "salary": 675000,
                        "isRemote": false
                    },
                    {
                        "id": 23,
                        "name": "Caesar Vance",
                        "title": "Pre-Sales Support",
                        "location": "New York",
                        "extn": "8330",
                        "startDate": "2011/12/12",
                        "salary": 106450,
                        "isRemote": false
                    },
                    {
                        "id": 24,
                        "name": "Doris Wilder",
                        "title": "Sales Assistant",
                        "location": "Sidney",
                        "extn": "3023",
                        "startDate": "2010/09/20",
                        "salary": 85600,
                        "isRemote": false
                    },
                    {
                        "id": 25,
                        "name": "Angelica Ramos",
                        "title": "Chief Executive Officer (CEO)",
                        "location": "London",
                        "extn": "5797",
                        "startDate": "2009/10/09",
                        "salary": 1200000,
                        "isRemote": false
                    },
                    {
                        "id": 26,
                        "name": "Gavin Joyce",
                        "title": "Developer",
                        "location": "Edinburgh",
                        "extn": "8822",
                        "startDate": "2010/12/22",
                        "salary": 92575,
                        "isRemote": false
                    },
                    {
                        "id": 27,
                        "name": "Jennifer Chang",
                        "title": "Regional Director",
                        "location": "Singapore",
                        "extn": "9239",
                        "startDate": "2010/11/14",
                        "salary": 357650,
                        "isRemote": false
                    },
                    {
                        "id": 28,
                        "name": "Brenden Wagner",
                        "title": "Software Engineer",
                        "location": "San Francisco",
                        "extn": "1314",
                        "startDate": "2011/06/07",
                        "salary": 206850,
                        "isRemote": false
                    },
                    {
                        "id": 29,
                        "name": "Fiona Green",
                        "title": "Chief Operating Officer (COO)",
                        "location": "San Francisco",
                        "extn": "2947",
                        "startDate": "2010/03/11",
                        "salary": 850000,
                        "isRemote": false
                    },
                    {
                        "id": 30,
                        "name": "Shou Itou",
                        "title": "Regional Marketing",
                        "location": "Tokyo",
                        "extn": "8899",
                        "startDate": "2011/08/14",
                        "salary": 163000,
                        "isRemote": false
                    },
                    {
                        "id": 31,
                        "name": "Michelle House",
                        "title": "Integration Specialist",
                        "location": "Sidney",
                        "extn": "2769",
                        "startDate": "2011/06/02",
                        "salary": 95400,
                        "isRemote": false
                    },
                    {
                        "id": 32,
                        "name": "Suki Burks",
                        "title": "Developer",
                        "location": "London",
                        "extn": "6832",
                        "startDate": "2009/10/22",
                        "salary": 114500,
                        "isRemote": false
                    },
                    {
                        "id": 33,
                        "name": "Prescott Bartlett",
                        "title": "Technical Author",
                        "location": "London",
                        "extn": "3606",
                        "startDate": "2011/05/07",
                        "salary": 145000,
                        "isRemote": false
                    },
                    {
                        "id": 34,
                        "name": "Gavin Cortez",
                        "title": "Team Leader",
                        "location": "San Francisco",
                        "extn": "2860",
                        "startDate": "2008/10/26",
                        "salary": 235500,
                        "isRemote": false
                    },
                    {
                        "id": 35,
                        "name": "Martena Mccray",
                        "title": "Post-Sales support",
                        "location": "Edinburgh",
                        "extn": "8240",
                        "startDate": "2011/03/09",
                        "salary": 324050,
                        "isRemote": false
                    },
                    {
                        "id": 36,
                        "name": "Unity Butler",
                        "title": "Marketing Designer",
                        "location": "San Francisco",
                        "extn": "5384",
                        "startDate": "2009/12/09",
                        "salary": 85675,
                        "isRemote": false
                    },
                    {
                        "id": 37,
                        "name": "Howard Hatfield",
                        "title": "Office Manager",
                        "location": "San Francisco",
                        "extn": "7031",
                        "startDate": "2008/12/16",
                        "salary": 164500,
                        "isRemote": false
                    },
                    {
                        "id": 38,
                        "name": "Hope Fuentes",
                        "title": "Secretary",
                        "location": "San Francisco",
                        "extn": "6318",
                        "startDate": "2010/02/12",
                        "salary": 109850,
                        "isRemote": false
                    },
                    {
                        "id": 39,
                        "name": "Vivian Harrell",
                        "title": "Financial Controller",
                        "location": "San Francisco",
                        "extn": "9422",
                        "startDate": "2009/02/14",
                        "salary": 452500,
                        "isRemote": false
                    },
                    {
                        "id": 40,
                        "name": "Timothy Mooney",
                        "title": "Office Manager",
                        "location": "London",
                        "extn": "7580",
                        "startDate": "2008/12/11",
                        "salary": 136200,
                        "isRemote": false
                    },
                    {
                        "id": 41,
                        "name": "Jackson Bradshaw",
                        "title": "Director",
                        "location": "New York",
                        "extn": "1042",
                        "startDate": "2008/09/26",
                        "salary": 645750,
                        "isRemote": false
                    },
                    {
                        "id": 42,
                        "name": "Olivia Liang",
                        "title": "Support Engineer",
                        "location": "Singapore",
                        "extn": "2120",
                        "startDate": "2011/02/03",
                        "salary": 234500,
                        "isRemote": false
                    },
                    {
                        "id": 43,
                        "name": "Bruno Nash",
                        "title": "Software Engineer",
                        "location": "London",
                        "extn": "6222",
                        "startDate": "2011/05/03",
                        "salary": 163500,
                        "isRemote": false
                    },
                    {
                        "id": 44,
                        "name": "Sakura Yamamoto",
                        "title": "Support Engineer",
                        "location": "Tokyo",
                        "extn": "9383",
                        "startDate": "2009/08/19",
                        "salary": 139575,
                        "isRemote": false
                    },
                    {
                        "id": 45,
                        "name": "Thor Walton",
                        "title": "Developer",
                        "location": "New York",
                        "extn": "8327",
                        "startDate": "2013/08/11",
                        "salary": 98540,
                        "isRemote": false
                    },
                    {
                        "id": 46,
                        "name": "Finn Camacho",
                        "title": "Support Engineer",
                        "location": "San Francisco",
                        "extn": "2927",
                        "startDate": "2009/07/07",
                        "salary": 87500,
                        "isRemote": false
                    },
                    {
                        "id": 47,
                        "name": "Serge Baldwin",
                        "title": "Data Coordinator",
                        "location": "Singapore",
                        "extn": "8352",
                        "startDate": "2012/04/09",
                        "salary": 138575,
                        "isRemote": false
                    },
                    {
                        "id": 48,
                        "name": "Zenaida Frank",
                        "title": "Software Engineer",
                        "location": "New York",
                        "extn": "7439",
                        "startDate": "2010/01/04",
                        "salary": 125250,
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





        vm.init();
    }

    angular
        .module("uam")
        .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl',
            'sampleSelectMenuFormConfig', "sampleGrid1Config",
            "rpGridModel",
            "rpGridTransform", "accountsContent",
            AccountsCtrl
        ]);
})(angular);