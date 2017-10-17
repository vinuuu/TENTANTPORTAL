//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAssignFloorPlansModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        flrPlnAside
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.isPageActive = true;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedListFloorplans");
            flrPlnAside.hide();
        };

        vm.closeAside = function () {
            flrPlnAside.hide();
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
        .module("uam")
        .controller("FpuAmenityPropDetAssignFloorPlansModalCtrl", [
            "$scope",
            "fpAmenityAddFloorPlansModel",
            "fpAmenityAddFloorPlansConfig",
            "pubsub",
            "AddFloorPlanListManager",
            "fpuAmenityPropDetailsFlrPlnAssignAside",
            FpuAmenityPropDetAssignFloorPlansModalCtrl
        ]);
})(angular);
