//  floorPlansAmenityAdd Units  Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridConfig, 
        gridModel, 
        gridTransformSvc, 
        gridPaginationModel,         
        asideUnitManager) {
        var model = {},
            grid = gridModel(),
            gridTransform = gridTransformSvc(),
            gridPagination = gridPaginationModel();

        var cfg = {
            recordsPerPage: 8
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

        model.assignUnits = function () {
            model.setGridPagination();            
        };

        
        model.getAllData = function () {
            return asideUnitManager.getList().records;
        };

        model.getSelectedRecords = function () {
            return grid.getSelectionChanges();
        };

        model.setGridPagination = function () {
            model.gridPagination.setData(model.getAllData()).goToPage({
                number: 0
            });
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        model.reset = function () {
            // model.grid.destroy();
            // model.grid = undefined;
            // model.gridPagination.destroy();
            // model.gridPagination = undefined;
            // model.deleteFloorplanModal = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("floorPlansUpgEliunitsModel", [
            "floorPlansUpgEliUnitsConfig",
            "rpGridModel",
            "rpGridTransform",            
            "rpGridPaginationModel",                             
            "UnitsUpgradeEligibleListManager",
            factory
        ]);
})(angular);
