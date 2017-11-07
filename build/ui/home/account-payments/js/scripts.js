//  Source: ui\home\account-payments\js\controllers\accounts.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = accountsMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            $http.get('/api/budgeting/coa/glaccount/Update').then(function(response) {
                notifSvc.error('Error');
            }).catch(function(ex) {
                model.mockData();
            });
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
        .controller("accountsCtrl", ["$scope", '$http', 'notificationService', 'accountsMdl', AccountsCtrl]);
})(angular);

//  Source: ui\home\account-payments\js\models\accounts.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function accountsMdl() {
        var model = {},
            response = {};
        model.init = function() {
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
        return model;
    }

    angular
        .module("uam")
        .factory("accountsMdl", [accountsMdl]);
})(angular);


