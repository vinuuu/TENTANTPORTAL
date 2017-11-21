//  units UpgradeEligible List Model Model

(function (angular, undefined) {
    "use strict";

    function factory(gridConfig, gridModel, gridTransformSvc, $filter, gridPaginationModel, $modal, $templateCache, $aside, addUugEligibleManager, pubsub) {
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

            model.deleteFloorplanModal = $modal({
                show: false,
                placement: "center",
                templateUrl: "home/floorplan-unit/amenity-property-details-units/templates/remove-upgrade-eligible-unit.html",
                backdrop: true,
                controller: "FpuAmenityPropDetUnitsUpgEliModalCtrl",
                controllerAs: "ctrlUPgEli"
            });

            pubsub.subscribe("amenityDetails.updateSelectedListUnitsUpgEli", model.setGridPagination);

            return model;
        };

        model.edit = function (record) {            
            logc("Edit");
        };

        model.view = function (record) {            
            logc("view");
        };

        model.unitRemove = function (record) {
            logc("UE Del =>", record);
            record.isSelected = false;
            grid.deleteRow("unitId", record);
        };

        model.setSelectedUpgradeEligibleUnitsForDisplay = function () {
            model.units = "";
            model.isUpgradeEligibleUnitsSelected = false;
            var units = model.getSelectedRecords();

            if (units.selected.length > 0) {
                model.isUpgradeEligibleUnitsSelected = true;
                units.selected.forEach(function (item) {
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

        model.deleteSelectedupgradeEligibleUnits = function (dataSvcDel) {

            var units = model.getSelectedRecords();

            if (units.selected.length > 0) {
                units.selected.forEach(function (item) {
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

                        // return dataSvcDel.deleteSelectedFloorPlans(paramData);
                    }

                });

            }
            else {
                logc("Please select an Unit to Delete !!");
            }
        };

        model.showUnitsModal = function () {
            model.deleteFloorplanModal.$promise.then(function () {
                model.deleteFloorplanModal.show();
            });
        };

        model.hideConfirmModal = function () {
            model.deleteFloorplanModal.$promise.then(function () {
                model.deleteFloorplanModal.hide();
            });
        };

        model.editUnits = function (record) {
            logc("Edit Unit !!");
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
            return addUugEligibleManager.getSelectedList();
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
        .module("ui")
        .factory("unitsUpgradeEligibleListModel", [
            "unitsUpgradeEligibleConfig",
            "rpGridModel",
            "rpGridTransform",
            "$filter",
            "rpGridPaginationModel",
            "$modal",
            "$templateCache",
            "$aside",
            "UnitsUpgradeEligibleListManager",
            "pubsub",
            factory
        ]);
})(angular);
