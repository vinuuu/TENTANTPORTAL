//  Source: uam\home\activity\js\controllers\activity.js
//  Home Controller

(function (angular, undefined) {
    "use strict";

    function ActivityCtrl($scope) {
        var vm = this;

        vm.init = function () {
            vm.message = "Welcome to Activity";
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
        .module("uam")
        .controller("ActivityCtrl", ["$scope", ActivityCtrl]);
})(angular);

