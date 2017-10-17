//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAssignUpgradeEligibleModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        flrPlnUpgEliAside
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;

            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedListUpgradeEligible");
            flrPlnUpgEliAside.hide();
        };

        vm.closeAside = function () {
            flrPlnUpgEliAside.hide();
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
        .controller("FpuAmenityPropDetAssignUpgradeEligibleModalCtrl", [
            "$scope",
            "fpAmenityUpgradeEligibleModel",
            "floorPlansAmenityUpgradeEligibleConfig",
            "pubsub",
            "UpgradeEligibleListManager",
            "fpuAmenityPropDetailsFlrPlnUpgEliAssignAside",
            FpuAmenityPropDetAssignUpgradeEligibleModalCtrl
        ]);
})(angular);
