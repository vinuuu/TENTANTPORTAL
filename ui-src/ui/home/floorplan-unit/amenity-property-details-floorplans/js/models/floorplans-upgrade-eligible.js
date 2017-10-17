//  floorPlansAmenityAddedModel Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridConfig, 
        gridModel, 
        gridTransformSvc, 
        $filter, 
        gridPaginationModel, 
        $modal, 
        $templateCache,         
        addUugEligibleManager, 
        pubsub
        ) {
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
                templateUrl: "home/floorplan-unit/amenity-property-details-floorplans/templates/remove-upgrade-eligible-property.html",
                backdrop: true,
                controller: "FpuAmenityPropDetUpgradeEligibleModalCtrl",
                controllerAs: "ctrlUE"
            });

            pubsub.subscribe("amenityDetails.updateSelectedListUpgradeEligible", model.setGridPagination);

            return model;
        };

        model.edit = function (record) {
            logc("Edit");
        };

        model.view = function (record) {
            logc("view");
        };

        model.upgradeEligibleFloorPlanDelete = function (record) {
            logc("UE Del =>", record);
            record.isSelected = false;
            grid.deleteRow("floorPlanId", record);
        };

        model.setSelectedUpgradeEligibleFloorPlanForDisplay = function () {
            model.floorPlanNames = "";
            model.isUpgradeEligibleFloorPlansSelected = false;
            var selFloorPlans = model.getSelectedRecords();
            logc(selFloorPlans);
            if (selFloorPlans.selected.length > 0) {
                model.isUpgradeEligibleFloorPlansSelected = true;
                selFloorPlans.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        floorPlanId: item
                    });
                    if (selObj.length > 0) {
                        logc(selObj);
                        model.floorPlanNames += selObj[0].floorplanName + ", ";
                    }

                });

            }
            return model;
        };

        model.deleteSelectedupgradeEligibleFloorPlan = function (dataSvcDel) {

            var selFloorPlans = model.getSelectedRecords();
            logc(selFloorPlans);
            if (selFloorPlans.selected.length > 0) {
                selFloorPlans.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        floorPlanId: item
                    });
                    if (selObj.length > 0) {
                        var paramData = {
                            floorPlanId: item
                        };
                        selObj[0].isSelected = false;
                        grid.deleteRow("floorPlanId", selObj[0]);
                        logc("Deleted Floorplan ==> ", item);

                        // return dataSvcDel.deleteSelectedFloorPlans(paramData);
                    }

                });

            }
            else {
                logc("Please select an Floorplan to Delete !!");
            }
        };

        model.showFloorplanModal = function () {
            model.deleteFloorplanModal.$promise.then(function () {
                model.deleteFloorplanModal.show();
            });
        };

        model.hideModal = function () {
            model.deleteFloorplanModal.$promise.then(function () {
                model.deleteFloorplanModal.hide();
            });
        };

        model.editFloorplan = function (record) {
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
        .module("uam")
        .factory("fpUpgradeEligibleListModel", [
            "floorPlansUpgradeEligibleConfig",
            "rpGridModel",
            "rpGridTransform",
            "$filter",
            "rpGridPaginationModel",
            "$modal",
            "$templateCache",            
            "UpgradeEligibleListManager",
            "pubsub",
            factory
        ]);
})(angular);
