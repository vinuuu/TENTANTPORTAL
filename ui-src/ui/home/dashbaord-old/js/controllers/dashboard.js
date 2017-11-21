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
        .module("ui")
        .controller("dashboardCtrl", ["$scope", '$http', 'notificationService', 'dashboardMdl', DashboardCtrl]);
})(angular);