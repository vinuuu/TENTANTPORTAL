//  Home Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitPropertiesCtrl($scope) {
        var vm = this;

        vm.init = function () {
            vm.message = "Welcome to Floor Plan Unit Properties";
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
        .controller("FloorPlanUnitPropertiesCtrl", ["$scope", FloorPlanUnitPropertiesCtrl]);
})(angular);
