//  Floorplan Unit Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitCtrl($scope, tabsMenu, tabsData) {
        var vm = this;

        vm.init = function () {
            vm.tabsData = tabsData;
            vm.tabsMenu = tabsMenu.init().getMenu();
            vm.message = "Welcome to Floor Plan Units";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            tabsMenu.reset();

            tabsMenu = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FloorPlanUnitCtrl", [
            "$scope",
            "amenitiesTabsMenu",
            "amenitiesTabsData",
            FloorPlanUnitCtrl
        ]);
})(angular);
