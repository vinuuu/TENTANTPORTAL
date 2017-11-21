//  Amenities Model

(function (angular, undefined) {
    "use strict";

    function factory(
        $filter, 
        gridConfig, 
        gridModel, 
        gridTransformSvc, 
        gridActions, 
        gridPaginationModel,
        $modal
        ) {
        var model = {},
            grid = gridModel(),
            gridTransform = gridTransformSvc(),
            gridPagination = gridPaginationModel();

        var cfg = {
            recordsPerPage: 8
        };

        model.asideScope = {};

        model.init = function () {
            model.grid = grid;
            gridTransform.watch(grid);
            grid.setConfig(gridConfig);

            gridPagination.setConfig(cfg);
            gridPagination.setGrid(grid).trackSelection(gridConfig.getTrackSelectionConfig());

            model.gridPagination = gridPagination;

            model.deleteAmenitiesModal = $modal({
                show: false,
                placement: "center",
                templateUrl: "home/floorplan-unit/amenities/templates/delete-amenities.html",
                backdrop: true,
                controller: "FpuAmenityPropDetDeleteConfirmModalCtrl",
                controllerAs: "ctrl"
            });

            model.deleteAmenityModal = $modal({
                show: false,
                placement: "center",
                templateUrl: "home/floorplan-unit/amenities/templates/delete-amenity.html",
                backdrop: true,
                controller: "FpuAmenityPropDetDeleteConfirmModalCtrl",
                controllerAs: "ctrl"
            });

            return model;
        };

      //  model.assignSelAmenitiesToProperties = function () {
            //logc("Selected amenities will be assigned to properties !!");
            
        //};

        model.createNewAmenity = function () {
            logc("New amenity will be created !!");
        };

        model.edit = function (record) {            
            logc("Edit");
            logc(record);
        };

        model.view = function (record) {            
            logc("view");
            logc(record);
        };

        model.setDeleteAmenity = function (record) {
            model.delRecord = record;
        };

        model.getDeleteAmenity = function () {
            return model.delRecord ;
        };

        model.deleteAmenity = function () {
            var record = model.getDeleteAmenity();
            logc("Del =>", record);
            record.isSelected = false;
            grid.deleteRow("amenityID", record);
        };

        model.setSelectedAmenitiesForDelete = function () {
             model.amenityNames = "" ;   
             var selAmenities = model.getSelectedRecords();
             model.isAmenitiesSelected = false;
             
             if (selAmenities.selected.length > 0) {
                model.isAmenitiesSelected = true;
                selAmenities.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        amenityID: item
                    });
                    if (selObj.length > 0) {
                        logc("Sel Amenity for DEL",selObj);
                        model.amenityNames += selObj[0].amenityName + ", ";                        
                    }

                });

            }
            return model;
        };

        model.deleteSelectedAmenities = function (dataSvcDel) {

            var selAmenities = model.getSelectedRecords();
            logc(selAmenities);
            if (selAmenities.selected.length > 0) {
                selAmenities.selected.forEach(function (item) {
                    var selObj = $filter("filter")(model.gridPagination.data, {
                        amenityID: item
                    });
                    if (selObj.length > 0) {
                        var paramData = {
                            amenityID: item
                        };

                        grid.deleteRow("amenityID", selObj[0]);
                        logc("Deleted Amenity ==> ", item);

                        // return dataSvcDel.deleteSelectedAmenity(paramData);
                    }

                });

            }
            else {
                logc("Please select an Amenity to Delete !!");
            }
        };

        model.showDeleteConfirmModal = function () {
            model.deleteAmenitiesModal.$promise.then(function () {
                model.deleteAmenitiesModal.show();
            });
        };

        model.hideDeleteConfirmModal = function () {
            model.deleteAmenitiesModal.$promise.then(function () {
                model.deleteAmenitiesModal.hide();
            });
        };

        model.showDeleteAmenityConfirmModal = function () {
            model.deleteAmenityModal.$promise.then(function () {
                model.deleteAmenityModal.show();
            });
        };

        model.hideDeleteAmenityConfirmModal = function () {
            model.deleteAmenityModal.$promise.then(function () {
                model.deleteAmenityModal.hide();
            });
        };

        model.editAmenity = function (record) {
            logc("Edit Amenity !!");
            logc(record);
        };

        model.getData = function (dataSvcGet) {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(model.setDataFromSvc, model.setDataErr);

        };

        model.getSelectedRecords = function () {
            return grid.getSelectionChanges();
        };

        model.setDataFromSvc = function (data) {
            model.gridPagination.setData(data.records).goToPage({
                number: 0
            });
        };

        model.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        model.resetGridFilters = function () {
            grid.resetFilters();
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("amenitiesModel", [
            "$filter",
            "fpuAmenitiesListConfig",
            "rpGridModel",
            "rpGridTransform",
            "fpuAmenitiesListActions",
            "rpGridPaginationModel",
            "$modal",
            factory
        ]);
})(angular);
