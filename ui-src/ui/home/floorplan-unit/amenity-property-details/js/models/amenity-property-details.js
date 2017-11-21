//  Amenity Details Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridModel,
        gridTransformSvc,
        gridPaginationModel,
        gridConfig,
        managerModel,
        pubsub,
        aside,
        context,
        amenAsideManagerModel
    ) {
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

            return model;
        };

        model.getSelectedProperty = function () {
            model.selectedProperty = context.get();
            return model;
        };

        model.setGridPagination = function () {
            model.gridPagination.setData(model.getSelectedList()).goToPage({
                number: 0
            });
        };

        model.closeAsideDetail = function () {
            aside.hide();
        };

        model.getSelectedList = function () {
            return managerModel.getSelectedList();
        };

        model.getSelectedRecords = function () {
            return gridPagination.getSelectionChanges();
        };

        model.getAmenityData = function () {
            return model.record;
        };

        model.showSelectionChanges = function () {
            logc(grid.getSelectionChanges());
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        model.reset = function () {
            // model.grid.destroy();
            // model.gridPagination.destroy();
            // model.grid = undefined;
            // model.gridPagination = undefined;
            // model.asidePropDetail = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("amenityPropDetailsModel", [
            "rpGridModel",
            "rpGridTransform",
            "rpGridPaginationModel",
            "fpuAmenityDetailsConfig",
            "AmenitiesListManager",
            "pubsub",
            "fpuAmenityPropDetailsAside",
            "fpuAmenityPropDetailsContext",
            factory
        ]);
})(angular);
