//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetFloorPlansModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideModal = function () {
            model.hideModal();
        };

        vm.confirmDeleteSelectedFloorPlans = function () {
            logc("Confirmed Delete");
            vm.hideModal();            
            model.deleteSelectedFloorplans();
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
        .module("uam")
        .controller("FpuAmenityPropDetFloorPlansModalCtrl", [
            "$scope",
            "fpAmenityAddedModel",
            FpuAmenityPropDetFloorPlansModalCtrl
        ]);
})(angular);
