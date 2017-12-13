(function() {
    'use strict';



    function Controller($scope, $http, notifSvc, dashboardMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = dashboardMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.getdashboardList();
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

//  Configure Meta Data

(function(angular) {
    "use strict";

    function config(prov) {
        prov.setProduct({
            name: sessionStorage.getItem('companyName')
        });

    }

    angular
        .module("ui")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);