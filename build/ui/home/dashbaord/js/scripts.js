//  Source: ui\home\dashbaord\js\controllers\dashboard.js
(function() {
    'use strict';



    function Controller($scope, $http, notifSvc, dashboardMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = dashboardMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.getdashboardList();

            model.mockData();

        };
        vm.destroy = function() {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }


    angular
        .module('ui')
        .controller('dashboardCtrl', Controller);

    Controller.$inject = ["$scope", '$http', 'notificationService', 'dashboardMdl'];
})();

//  Source: ui\home\dashbaord\js\models\dashboard.js
(function() {
    'use strict';



    function factory(dashboardSvc, $http) {
        var model = {},
            response = {};
        model.init = function() {

            return model;
        };

        model.getdashboardList = function() {


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
            dashboardSvc.getLeaseList(obj).then(function(response) {
                if (response.data && response.data.length > 0) {

                    model.tenantlist = response.data;
                }

                // // var gg = angular.element(".acr-content2")[0].offsetHeight;
                // var element = angular.element(document.querySelector('#myDiv'));
                // var height = element[0].offsetHeight;

            });

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
        .module('ui')
        .factory('dashboardMdl', factory);

    factory.$inject = ['dashboardSvc', '$http'];
})();

//  Source: ui\home\dashbaord\js\services\dashboardSvc.js
(function() {
    'use strict';



    function factory($http) {
        return {
            getLeaseList: function(obj) {
                return $http.post('/api/dashboard', obj);
            }
        };
    }

    angular
        .module('ui')
        .factory('dashboardSvc', factory);

    factory.$inject = ['$http'];

})();


