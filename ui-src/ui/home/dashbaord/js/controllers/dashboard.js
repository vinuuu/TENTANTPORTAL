//  Home Controller

(function(angular, undefined) {
    "use strict";

    function DashboardCtrl($scope, $http, notifSvc, dashboardMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = dashboardMdl;
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
        .controller("dashboardCtrl", ["$scope", '$http', 'notificationService', 'dashboardMdl', DashboardCtrl]);
})(angular);