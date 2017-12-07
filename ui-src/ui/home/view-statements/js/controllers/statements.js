//  Home Controller

(function(angular, undefined) {
    "use strict";

    function StatementsCtrl($scope, $http, notifSvc, statementsMdl) {
        var vm = this,
            model;

        vm.init = function() {
            vm.model = model = statementsMdl;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
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
        .controller("statementsCtrl", ["$scope", '$http', 'notificationService', 'statementsdMdl', StatementsCtrl]);
})(angular);