//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUnitsUpgEliModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideConfirmUpgEliModal = function () {
            model.hideConfirmModal();
        };

        vm.confirmDeleteSelectedUpgEliUnits = function () {
            logc("Confirmed Delete");
            vm.hideConfirmUpgEliModal();            
            model.deleteSelectedupgradeEligibleUnits();            
        };

        // vm.selectedFloorPlansForDisplay = function () {
            
        // };

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
        .controller("FpuAmenityPropDetUnitsUpgEliModalCtrl", [
            "$scope",
            "unitsUpgradeEligibleListModel",
            FpuAmenityPropDetUnitsUpgEliModalCtrl
        ]);
})(angular);
