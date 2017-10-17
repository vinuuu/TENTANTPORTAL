//  FloorPlanUnit Amenities Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenitiesCtrl(
        $scope, 
        dataSvcGet, 
        model, 
        gridConfig, 
        gridActions, 
        dataSvcDel,assignAmenitiesToProperties) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);
            gridActions.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.loadData();

            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.assignSelAmenitiesToProperties = function () {

            var selAmenities = model.getSelectedRecords();
            assignAmenitiesToProperties.getSelectData(selAmenities);
           // model.assignSelAmenitiesToProperties();
        };

        vm.mergeAmenities = function () {
            logc("Merge Amenities");
            // model.mergeAmenities();
        };

        vm.createNewAmenity = function () {
            model.createNewAmenity();
        };

        vm.deleteSelectedAmenities = function () {
            model.setSelectedAmenitiesForDelete();
            if (model.isAmenitiesSelected) {
                model.showDeleteConfirmModal();
            }            
        };

        vm.deleteAmenity = function (record) {            
             model.setDeleteAmenity(record);
             model.showDeleteAmenityConfirmModal(record);
        };

        vm.editAmenity = function (record) {
            model.editAmenity(record);
        };

        vm.view = function (record) {            
            model.view(record);
        };

        vm.edit = function (record) {            
            model.edit(record);
        };



        vm.loadData = function () {
            model.getData(dataSvcGet);
        };

        vm.showSelectionChanges = function () {
            model.showSelectionChanges();
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.setData = function (data) {
            model.setData(data.records).goToPage({
                number: 0
            });
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            model = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("uam")
        .controller("FpuAmenitiesCtrl", [
            "$scope",
            "fpuAmenitiesDataSvc",
            "amenitiesModel",
            "fpuAmenitiesListConfig",
            "fpuAmenitiesListActions",
            "amenitiesDeleteSvc",
            "assignAmenitiesToProperties",
            FpuAmenitiesCtrl
        ]);
})(angular);
