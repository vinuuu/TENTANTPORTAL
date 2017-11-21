//  Home Controller

(function (angular, undefined) {
    "use strict";

    function CommonAreaCtrl($scope) {
        var vm = this;

        vm.init = function () {
            vm.message = "Welcome to Common Area";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("CommonAreaCtrl", ["$scope", CommonAreaCtrl]);
})(angular);
