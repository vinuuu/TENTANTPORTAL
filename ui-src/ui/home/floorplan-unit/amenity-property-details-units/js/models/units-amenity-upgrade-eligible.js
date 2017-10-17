//  floorPlansAmenityAdd Upgrade Eligible Model

(function (angular, undefined) {
    "use strict";

    function factory(gridConfig, gridModel, gridTransformSvc, $filter, gridPaginationModel, $modal, $templateCache, $aside, addUpgEligibleManager) {
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

       

        // model.assignUpgradeEligible = function () {
        //     model.setGridPagination();
        //     model.showAssignUpgradeEligibleModal();
        // };

        // model.showAssignUpgradeEligibleModal = function () {
        //     model.asideAssignUpgradeEligibleModal.$promise.then(function () {
        //         model.asideAssignUpgradeEligibleModal.show();
        //     });
        // };

        // model.hideAssignUpgradeEligibleModal = function () {
        //     model.asideAssignUpgradeEligibleModal.$promise.then(function () {
        //         model.asideAssignUpgradeEligibleModal.hide();
        //     });
        // };


        model.getAllData = function () {            
            return addUpgEligibleManager.getList().records;
        };


        model.getSelectedRecords = function () {
            return grid.getSelectionChanges();
        };

        model.setGridPagination = function (data) {            
            model.gridPagination.setData(model.getAllData()).goToPage({
                number: 0
            });
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        model.reset = function () {
            model.grid.destroy();
            model.grid = undefined;
            model.gridPagination.destroy();
            model.gridPagination = undefined;
            // model.deleteFloorplanModal = undefined;
        };

        return model.init();
    }

    angular
        .module("uam")
        .factory("unitsAmenityUpgradeEligibleModel", [
            "unitsAmenityUpgradeEligibleConfig",
            "rpGridModel",
            "rpGridTransform",            
            "$filter",
            "rpGridPaginationModel",
            "$modal",
            "$templateCache",
            "$aside",
            "UpgradeEligibleListManager",
            factory
        ]);
})(angular);
