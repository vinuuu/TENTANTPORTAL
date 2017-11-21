//  Amenity Assign Prop Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridModel,
        gridTransformSvc,
        $filter,
        gridPaginationModel,
        gridConfig) {
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

        model.assignPropertiesToAmenity = function () {
            model.setGridPagination(model.getAllData());
        };

        model.setGridPagination = function (data) {
            model.gridPagination.setData(data.records).goToPage({
                number: 0
            });
        };

        model.setAllData = function (data) {
            model.list = data;
            return model;
        };

        model.getSelectedRecords = function () {
            return grid.getSelectionChanges();
        };

        model.getAllData = function () {
            return model.list;
        };

        model.reset = function () {

            var selDelProperties = model.getSelectedRecords();
            logc(selDelProperties);
            var filter, newList;
            var allProperties = model.getAllData();
            selDelProperties.selected.forEach(function (item) {

                filter = {
                    siteID: item
                };

                newList = $filter("filter")(allProperties.records, filter);
                if (newList.length > 0) {
                    newList[0].isSelected = false;
                }

            });

            selDelProperties.deselected.forEach(function (item) {
                logc(item);

                filter = {
                    siteID: item
                };

                newList = $filter("filter")(allProperties.records, filter);
                if (newList.length > 0) {
                    newList[0].isSelected = true;
                }

            });

        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("amenityAssignPropModel", [
            "rpGridModel",
            "rpGridTransform",
            "$filter",
            "rpGridPaginationModel",
            "floorPlanUnitAmenityAssignPropConfig",
            factory
        ]);
})(angular);
