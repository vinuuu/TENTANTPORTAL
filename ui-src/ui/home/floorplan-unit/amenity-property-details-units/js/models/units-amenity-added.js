//  units AmenityAdded Model 

(function (angular, undefined) {
    "use strict";

    function factory(gridConfig, gridModel, gridTransformSvc,
        $filter, gridPaginationModel, $modal, $templateCache,
        $aside, unitsListManager, pubsub) {
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

            model.deleteUnitsModal = $modal({
                show: false,
                placement: "center",
                templateUrl: "home/floorplan-unit/amenity-property-details-units/templates/remove-amenityadd-unit.html",
                backdrop: true,
                controller: "FpuAmenityPropDetUnitsConfirmModalCtrl",
                controllerAs: "ctrl"
            });

            // pubsub.subscribe("FpaPropDetPricePointUnits.updatePricePointUnits", model.setGridPagination);
            pubsub.subscribe("amenityPropDetAmeAddAssignUnits.updateSelectedListUnits", model.setGridPagination);

            return model;
        };

        model.edit = function (record) {
            logc("Edit");
        };

        model.view = function (record) {
            logc("view");
        };

        model.unitRemove = function (record) {
            logc("Del =>", record);
            record.isSelected = false;
            grid.deleteRow("unitId", record);
        };

        model.setSelectedUnitsForDisplay = function () {
            model.units = "";
            var selUnits = model.getSelectedRecords();
            model.isUnitsSelected = false;

            if (selUnits.selected.length > 0) {
                model.isUnitsSelected = true;
                selUnits.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        unitId: item
                    });
                    if (selObj.length > 0) {
                        model.units += selObj[0].unitNo + ", ";
                    }

                });

            }
            return model;
        };

        model.getSelectedUnitNosForDisplay = function () {
            model.unitNos = "";
            var selUnits = model.getSelectedRecords();
            model.isUnitsSelectedDisplay = false;

            if (selUnits.selected.length > 0) {
                model.isUnitsSelectedDisplay = true;
                selUnits.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        unitId: item
                    });
                    if (selObj.length > 0) {
                        model.unitNos += selObj[0].unitNo + ", ";
                    }

                });

            }
            return model;
        };

        model.deleteSelectedAmeAddUnits = function (dataSvcDel) {
            var selUnits = model.getSelectedRecords();
            logc(selUnits);
            if (selUnits.selected.length > 0) {
                selUnits.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        unitId: item
                    });
                    if (selObj.length > 0) {
                        var paramData = {
                            unitId: item
                        };
                        selObj[0].isSelected = false;
                        grid.deleteRow("unitId", selObj[0]);
                        logc("Deleted Unit ==> ", item);

                        // return dataSvcDel.deleteSelectedUnits(paramData);
                    }

                });

            }
            else {
                logc("Please select an Unit to Delete !!");
            }
        };

        model.showUnitsModal = function () {
            model.deleteUnitsModal.$promise.then(function () {
                model.deleteUnitsModal.show();
            });
        };

        model.hideConfirmModal = function () {
            model.deleteUnitsModal.$promise.then(function () {
                model.deleteUnitsModal.hide();
            });
        };

        model.editUnits = function (record) {
            logc("Edit Amenity !!");
        };

        model.getSelectedRecords = function () {
            return grid.getSelectionChanges();
        };

        model.setGridPagination = function () {
            model.gridPagination.setData(model.getSelectedList()).goToPage({
                number: 0
            });
        };

        model.getSelectedList = function () {
            return unitsListManager.getSelectedList();
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        model.reset = function () {
            model.grid.destroy();
            model.grid = undefined;
            model.gridPagination.destroy();
            model.gridPagination = undefined;

        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("unitsAmenityAddedModel", [
            "unitsAmenityAddedConfig",
            "rpGridModel",
            "rpGridTransform",
            "$filter",
            "rpGridPaginationModel",
            "$modal",
            "$templateCache",
            "$aside",
            "AddUnitsListManager",
            "pubsub",
            factory
        ]);
})(angular);
