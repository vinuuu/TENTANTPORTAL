//  FloorPlanUnit Amenitity Details Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitAmenityAssignPropCtrl($scope, pubsub, model, gridConfig, dataSvcGet, managerModel, ameAssignPropAsideManager) {
        var vm = this;

        vm.init = function () {
            vm.isPageActive = true; 
            gridConfig.setSrc(vm);
            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            model.assignPropertiesToAmenity();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.closeAside = function () {
            model.reset();
            // model.closeAside();
            ameAssignPropAsideManager.hideModal();
            vm.isPageActive = false; 
        };

        vm.assign = function () {
            managerModel.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedList");
            ameAssignPropAsideManager.hideModal();
        };

        vm.destroy = function () {
            vm.destWatch();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FloorPlanUnitAmenityAssignPropCtrl", [
            "$scope",
            "pubsub",
            "amenityAssignPropModel",
            "floorPlanUnitAmenityAssignPropConfig",
            "floorPlanUnitAmenityAssignPropDataSvc",
            "AmenitiesListManager",
            "AmenityAssignPropAsideManager",
            FloorPlanUnitAmenityAssignPropCtrl
        ]);
})(angular);
