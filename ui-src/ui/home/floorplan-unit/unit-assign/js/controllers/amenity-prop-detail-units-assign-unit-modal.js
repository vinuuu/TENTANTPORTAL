//  Floorplan unit amenities  Property Details Floorplans Assign Unit Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAmeAddAssignUnitsModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        asideUnitManager
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.isPageActive = true;
            model.assignUnits();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityPropDetAmeAddAssignUnits.updateSelectedListUnits");
            asideUnitManager.hide();
        };

        vm.closeAside = function () {
            asideUnitManager.hide();
            vm.isPageActive = false;
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetAmeAddAssignUnitsModalCtrl", [
            "$scope",
            "floorPlansAmenityAddunitsModel",
            "floorPlansAmenityAddUnitsConfig",
            "pubsub",
            "AddUnitsListManager",
            "fpuAmenityPropDetailsUnitAssignAside",
            FpuAmenityPropDetAmeAddAssignUnitsModalCtrl
        ]);
})(angular);
