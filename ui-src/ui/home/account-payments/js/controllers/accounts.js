//  Home Controller

(function(angular, undefined) {
    "use strict";

    function AccountsCtrl($scope, $http, notifSvc, accountsMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = accountsMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            model.getCustData();
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