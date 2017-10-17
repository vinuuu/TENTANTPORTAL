//  Amenity Details Model

(function (angular, undefined) {
    "use strict";

    function factory(gridModel, gridTransformSvc, gridPaginationModel, gridConfig, assignPropModel, pubsub, managerModel, ameAssignPropAsideManager) {
        var model = {},
            grid = gridModel(),
            gridTransform = gridTransformSvc(),
            gridPagination = gridPaginationModel();

        var cfg = {
            recordsPerPage: 5
        };

        model.init = function () {
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);
            gridPagination.setConfig(cfg);
            gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());

            model.gridPagination = gridPagination;

            pubsub.subscribe("amenityDetails.updateSelectedList", model.setGridPagination);
            return model;
        };

         model.setSelectedAmenity = function (data) {
            model.record = data;
        };
       
        model.assignPropertiesToAmenity = function () {
            // assignPropModel.assignPropertiesToAmenity();
            ameAssignPropAsideManager.showAsideModal();
        };

        model.getPropertyList = function () {            
            return managerModel.getSelectedList();
        };

        model.setGridPagination = function () {            
            model.gridPagination.setData(model.getPropertyList()).goToPage({
                number: 0
            });
        };

        model.setAllData = function (data) {
            assignPropModel.setAllData(data);
            return model;
        };

        model.getSelectedRecords = function () {
            return gridPagination.getSelectionChanges();
        };

        model.showSelectionChanges = function () {
            logc(grid.getSelectionChanges());
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        return model.init();
    }

    angular
        .module("uam")
        .factory("amenityDetailsModel", [
            "rpGridModel",
            "rpGridTransform",
            "rpGridPaginationModel",
            "fpuAmenityDetailsConfig",
            "amenityAssignPropModel",
            "pubsub",
            "AmenitiesListManager",
            "AmenityAssignPropAsideManager",
            
            factory
        ]);
})(angular);
