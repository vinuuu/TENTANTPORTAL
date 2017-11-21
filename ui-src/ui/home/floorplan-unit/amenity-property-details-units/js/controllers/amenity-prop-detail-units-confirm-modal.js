//  Floorplan unit amenities  Property Details Units Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUnitsConfirmModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideConfirmModal = function () {
            model.hideConfirmModal();
        };

        vm.confirmDeleteSelectedUnits = function () {
            logc("Confirmed Delete");
            vm.hideConfirmModal();            
            model.deleteSelectedAmeAddUnits();
        };

        vm.selectedFloorPlansForDisplay = function () {
            
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
        .controller("FpuAmenityPropDetUnitsConfirmModalCtrl", [
            "$scope",
            "unitsAmenityAddedModel",
            FpuAmenityPropDetUnitsConfirmModalCtrl
        ]);
})(angular);
