//  FloorPlanUnit Amenitity Details Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityDetailsCtrl($scope, model, gridConfig, dataSvcGet, managerModel, context, aside) {
        var vm = this;

        vm.init = function () {
            vm.isPageActive = true; 
            gridConfig.setSrc(vm);
            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.loadData();

            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.loadData = function () {
            var amenity = context.get();
            model.setSelectedAmenity(amenity);
            vm.getData();
        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setDataFromSvc, vm.setDataErr);
        };

        model.closeAsideDetail = function () {
            aside.hide();
            vm.isPageActive = false; 
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.assignPropertiesToAmenity = function () {
            model.setAllData(managerModel.getList());
            model.assignPropertiesToAmenity();
        };

        vm.setDataFromSvc = function (data) {
            managerModel.setData(data);
            model.setGridPagination();
            return model;
        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.destroy = function () {
            vm.destWatch();
            // model = undefined;
            // dataSvcGet = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityDetailsCtrl", [
            "$scope",
            "amenityDetailsModel",
            "fpuAmenityDetailsConfig",
            "fpuAmenityDetailDataSvc",
            "AmenitiesListManager",
            "fpuAmenityDetailsContext",
            "fpuAmenityDetailsAside",
            FpuAmenityDetailsCtrl
        ]);
})(angular);
