//  Source: uam\home\dashbaord-old\js\controllers\dashboard.js
//  Home Controller

(function() {
    "use strict";

    function DashboardCtrl($scope, $http, notifSvc, dashboardMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = dashboardMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            // model.getDasghboardList();
            var inputObj = {
                "request": {
                    "operation": {
                        "authentication": {
                            "login": {
                                "userid": "srihari@realpage.com",
                                // "userid": model.username,
                                "password": "sriharI$4"
                            }
                        },
                        "content": {
                            "function": {
                                "getTPAPISession": {}
                            }
                        }
                    }
                }
            };
            $http.post('/api/login', inputObj).then(function(response) {
                model.mockData();
            }).catch(function(ex) {});
        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("uam")
        .controller("dashboardCtrl", ["$scope", '$http', 'notificationService', 'dashboardMdl', DashboardCtrl]);
})(angular);

//  Source: uam\home\dashbaord-old\js\models\dashboard.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function DashboardMdl(dashboardSvc, $http) {
        var model = {},
            response = {};
        model.init = function() {
            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "leaseoccupancy",
                                    "fields": "",
                                    "query": "",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };
            $http.post('/api/dashboard', obj);
            return model;
        };



        model.mockData = function() {
            response.records = {
                tenant: [{
                    name: "Tenant One",
                    tenantId: 1,
                    lease: [{
                        id: 1,
                        termFrom: "1/1/2016",
                        termTo: "12/31/2018",
                        propertyName: "Ashton Park",
                        unit: 101,
                        spaceSize: "22,222 Sq.ft",
                        details: {
                            previousStatement: "January 2016",
                            previousBalance: 27885.14,
                            credits: 27885.14,
                            billmonth: "February 2016",
                            totalAmount: "27885.14",
                            nextPaymentDue: "February 1,2016",
                            statementID: 1
                        }
                    }, {
                        id: 2,
                        termFrom: "1/1/2016",
                        termTo: "12/31/2017",
                        propertyName: "Ashton Park",
                        unit: 102,
                        spaceSize: "11,111 Sq.ft",
                        details: {
                            previousStatement: "January 2016",
                            previousBalance: 27885.14,
                            credits: 27885.14,
                            billmonth: "February 2016",
                            totalAmount: "27885.14",
                            nextPaymentDue: "February 1,2016",
                            statementID: 2
                        }
                    }]
                }, {
                    name: "Tenant Two",
                    tenantId: 2,
                    lease: [{
                        id: 1,
                        termFrom: "1/1/2016",
                        termTo: "12/31/2018",
                        propertyName: "Ashton Park",
                        unit: 101,
                        spaceSize: "22,222 Sq.ft",
                        details: {
                            previousStatement: "January 2016",
                            previousBalance: 27885.14,
                            credits: 27885.14,
                            billmonth: "February 2016",
                            totalAmount: "27885.14",
                            nextPaymentDue: "February 1,2016",
                            statementID: 1
                        }
                    }, {
                        id: 2,
                        termFrom: "1/1/2016",
                        termTo: "12/31/2017",
                        propertyName: "Ashton Park",
                        unit: 102,
                        spaceSize: "11,111 Sq.ft",
                        details: {
                            previousStatement: "January 2016",
                            previousBalance: 27885.14,
                            credits: 27885.14,
                            billmonth: "February 2016",
                            totalAmount: "27885.14",
                            nextPaymentDue: "February 1,2016",
                            statementID: 2
                        }
                    }]
                }]

            };
            model.bindtenantdata(response);
        };

        model.bindtenantdata = function(response) {
            model.list = response.records;
        };
        return model.init();
    }

    angular
        .module("uam")
        .factory("dashboardMdl", [DashboardMdl]);
    DashboardMdl.$inject = ['dashboardSvc', '$http'];
})(angular);

//  Source: uam\home\dashbaord-old\js\services\dashboardSvc.js
(function() {
    'use strict';

    function factory(http) {
        return {
            getDashboardData: function(obj) {
                return http.post('/api/dashboard', obj);
            }
        };
    }

    angular
        .module('uam')
        .factory('dashboardSvc', factory);

    factory.$inject = ['$http'];
})();


