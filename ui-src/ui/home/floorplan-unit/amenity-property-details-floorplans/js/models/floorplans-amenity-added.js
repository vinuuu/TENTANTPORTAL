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
        addFloorPlanManager, 
        pubsub) {
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
                templateUrl: "home/floorplan-unit/amenity-property-details-floorplans/templates/remove-floorplans-property.html",
                backdrop: true,
                controller: "FpuAmenityPropDetFloorPlansModalCtrl",
                controllerAs: "ctrl"
            });

            pubsub.subscribe("amenityDetails.updateSelectedListFloorplans", model.setGridPagination);

            return model;
        };

        model.edit = function (record) {            
            logc("Edit");            
        };

        model.view = function (record) {            
            logc("view");            
        };

        model.amAddFloorPlanDelete = function (record) {
            logc("Del =>", record);
            record.isSelected = false;
            grid.deleteRow("floorPlanId", record);
        };

        model.setSelectedFloorPlansForDisplay = function () {
             model.floorPlanNames = "" ;   
             var selFloorPlans = model.getSelectedRecords();
             model.isFloorPlansSelected = false;
             
             if (selFloorPlans.selected.length > 0) {
                model.isFloorPlansSelected = true;
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

        model.deleteSelectedFloorplans = function (dataSvcDel) {

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

        // model.setSelectedList = function (data) {
        //     model.selectedList = data;
        //     return model;
        // };

        
        model.getSelectedList = function () {
            return addFloorPlanManager.getSelectedList();
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
        .factory("fpAmenityAddedModel", [
            "fpAmenityAddedConfig",
            "rpGridModel",
            "rpGridTransform",
            "$filter",
            "rpGridPaginationModel",
            "$modal",
            "$templateCache",            
            "AddFloorPlanListManager",
            "pubsub",
            factory
        ]);
})(angular);
