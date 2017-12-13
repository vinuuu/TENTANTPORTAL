//  Source: ui\home\floorplan-unit\_base\js\_bundle.inc
//  Source: ui\home\floorplan-unit\_base\js\controllers\floorplan-unit.js
//  Floorplan Unit Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitCtrl($scope, tabsMenu, tabsData) {
        var vm = this;

        vm.init = function () {
            vm.tabsData = tabsData;
            vm.tabsMenu = tabsMenu.init().getMenu();
            vm.message = "Welcome to Floor Plan Units";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            tabsMenu.reset();

            tabsMenu = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FloorPlanUnitCtrl", [
            "$scope",
            "amenitiesTabsMenu",
            "amenitiesTabsData",
            FloorPlanUnitCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\_base\js\models\tabs-menu.js
//  Workspaces Config Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsModel, tabsData) {
        var model = {};

        model.init = function () {
            model.tabsData = tabsData.getTabsList();
            model.tabsMenu = tabsModel().setOptions(model.tabsData);
            return model;
        };

        model.getData = function () {
            return model.tabsData;
        };

        model.getMenu = function () {
            return model.tabsMenu;
        };

        model.subscribe = function (fn) {
            model.tabsMenu.subscribe("change", fn);
        };

        model.reset = function () {
            model.tabsMenu.destroy();
            model.tabsData = undefined;
            model.tabsMenu = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("amenitiesTabsMenu", ["rpTabsMenuModel", "amenitiesTabsData", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\_base\js\models\tabs-menu-data.js
//  Floorplan unit amenities tab menu Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.amenities = {
            id: "01",
            isActive: true,
            text: "Amenities",
            name: "Amenities"
        };

        model.properties = {
            id: "02",
            isActive: false,
            text: "Properties",
            name: "Properties"
        };

        model.getTabsList = function () {
            return [
            	model.amenities,
                model.properties
            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("amenitiesTabsData", [factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenities\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-name.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-name\">{{record.amenityName}}</span> <span class=\"grid-col-synd-name\">{{record.amenitySyndicationName}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-price.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-price\">{{record.priceRange}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/amenity-prop.html",
"<div fpu-amenity-actions class=\"grid-col-cursor\" ng-click=\"amenityActions.showAmenity(record)\"><span class=\"grid-col-prop\">{{record.totalProperties}}</span></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/delete-amenities.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Amenities</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrl.model.amenityNames}} from the amenity’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteSelectedAmenities()\">Delete</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/delete-amenity.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Amenities</h5></div><div class=\"modal-body p-lg\"><p>You are about to delete {{ctrl.model.delRecord.amenityName}} from the Master list. It will no longer be listed or available to assign to properties..</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideDeleteAmenityModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteAmenity()\">Delete</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenities/templates/edit-amenity.html",
"<div fpu-amenity-actions><a ng-click=\"amenityActions.editAmenity(record)\"><i class=\"icon rp-icon-pencil\"></i></a></div>");
}]);


//  Source: ui\home\floorplan-unit\amenities\js\controllers\amenities.js
//  FloorPlanUnit Amenities Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenitiesCtrl(
        $scope, 
        dataSvcGet, 
        model, 
        gridConfig, 
        gridActions, 
        dataSvcDel,assignAmenitiesToProperties) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);
            gridActions.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.loadData();

            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.assignSelAmenitiesToProperties = function () {

            var selAmenities = model.getSelectedRecords();
            assignAmenitiesToProperties.getSelectData(selAmenities);
           // model.assignSelAmenitiesToProperties();
        };

        vm.mergeAmenities = function () {
            logc("Merge Amenities");
            // model.mergeAmenities();
        };

        vm.createNewAmenity = function () {
            model.createNewAmenity();
        };

        vm.deleteSelectedAmenities = function () {
            model.setSelectedAmenitiesForDelete();
            if (model.isAmenitiesSelected) {
                model.showDeleteConfirmModal();
            }            
        };

        vm.deleteAmenity = function (record) {            
             model.setDeleteAmenity(record);
             model.showDeleteAmenityConfirmModal(record);
        };

        vm.editAmenity = function (record) {
            model.editAmenity(record);
        };

        vm.view = function (record) {            
            model.view(record);
        };

        vm.edit = function (record) {            
            model.edit(record);
        };



        vm.loadData = function () {
            model.getData(dataSvcGet);
        };

        vm.showSelectionChanges = function () {
            model.showSelectionChanges();
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.setData = function (data) {
            model.setData(data.records).goToPage({
                number: 0
            });
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            model = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenitiesCtrl", [
            "$scope",
            "fpuAmenitiesDataSvc",
            "amenitiesModel",
            "fpuAmenitiesListConfig",
            "fpuAmenitiesListActions",
            "amenitiesDeleteSvc",
            "assignAmenitiesToProperties",
            FpuAmenitiesCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\controllers\amenities-delete.js
//  Floorplan unit amenities  delete amenities Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetDeleteConfirmModalCtrl($scope, model, dataSvcDel) {
        var vm = this;

        vm.init = function () {                     
            vm.model = model;  
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
        };

        vm.hideModal = function () {
            model.hideDeleteConfirmModal();
        };

        vm.hideDeleteAmenityModal = function () {
            model.hideDeleteAmenityConfirmModal();
        };       
        

        vm.confirmDeleteSelectedAmenities = function () {
            logc("Confirmed Delete");
            vm.hideModal();            
            model.deleteSelectedAmenities(dataSvcDel);
        };

        vm.confirmDeleteAmenity = function () {
            logc("Confirmed Delete");
            vm.hideDeleteAmenityModal();            
            model.deleteAmenity(dataSvcDel);
        };


        vm.selectedFloorPlansForDisplay = function () {
            
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetDeleteConfirmModalCtrl", [
            "$scope",
            "amenitiesModel",
            "amenitiesDeleteSvc",
            FpuAmenityPropDetDeleteConfirmModalCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenities\js\directives\amenity-actions.js
//  Amenity Property

(function (angular, undefined) {
    "use strict";

    function fpuAmenityActions(editAside, editContext, detailsAside, detailsContext) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityActions = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.showAmenity = function (amenity) {
                detailsContext.set(amenity);
                detailsAside.show();
            };

            dir.editAmenity = function (amenity) {
                editContext.set(amenity);
                editAside.show();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("ui")
        .directive("fpuAmenityActions", [
            "fpuEditAmenityAside",
            "fpuEditAmenityContext",
            "fpuAmenityDetailsAside",
            "fpuAmenityDetailsContext",
            fpuAmenityActions
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenities\js\models\amenities-list-actions.js
//  FloorPlanUnit Amenities Actions Config

(function (angular) {
    "use strict";

    function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "View",
                        method: model.getMethod("view"),
                        data: record
                    },
                    {
                        text: "Edit",
                        method: model.getMethod("edit"),
                        data: record
                    },
                    {
                        text: "Assign Properties",
                        method: model.getMethod("assignSelAmenitiesToProperties"),
                        data: record
                    },
                    {
                        text: "Delete",
                        method: model.getMethod("deleteAmenity"),
                        data: record
                    }
                ],
                menuOffsetLeft: -230
            });
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmenitiesListActions", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\models\amenities-list-config.js
//  FloorPlanUnit Amenities Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig, actions) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "amenityID"
                },
                {
                    key: "amenityName",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-name.html"
                },
                {
                    key: "totalProperties",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-prop.html"
                },
                {
                    key: "priceRange",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-price.html"
                },
                {
                    key: "edit",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/edit-amenity.html",
                    className: "rp-actions-menu-item-1"
                },
                {
                    key: "more",
                    type: "actionsMenu",
                    getActions: actions.get
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "amenityID",
                        className: "amenity-id"
                    },
                    {
                        key: "amenityName",
                        text: "Name",
                        isSortable: true,
                        className: "amenity-name"
                    },
                    {
                        key: "totalProperties",
                        text: "Properties",
                        isSortable: true,
                        className: "total-properties"
                    },
                    {
                        key: "priceRange",
                        text: "Price",
                        isSortable: true,
                        className: "price-price"
                    },
                    {
                        key: "edit",
                        className: "edit"
                    },
                    {
                        key: "more",
                        className: "more"

                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "amenityID",
                },
                {
                    key: "amenityName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by amenity name"
                },
                {
                    key: "totalProperties"
                },
                {
                    key: "priceRange",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "No min - No max"
                },
                {
                    key: "edit"
                },
                {
                    key: "more"
               }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmenitiesListConfig", [
            "rpGridConfig",
            "fpuAmenitiesListActions",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\models\amenities-list-item.js
// //  Amenities List Item Model

// (function (angular) {
//     "use strict";

//     function factory() {
//         return function () {
//             var model = {};

//             model.amenityID = "";
//             model.amenityName = "";
//             model.amenitySyndicationName = "";
//             model.totalProperties = "";
//             model.minPrice = "";
//             model.maxPrice = "";
//             model.priceRange = model.getPriceRange();
//             model.isSelected = false;

//             model.setData = function (item) {
//                 model.setAmenityID(item.amenityID);
//                 model.setAmenityName(item.amenityName);
//                 model.setAmenitySyndicationName(item.amenitySyndicationName);
//                 model.setTotalProperties(item.totalProperties);
//                 model.setMinPrice(item.minPrice);
//                 model.setMaxPrice(item.maxPrice);
//                 model.getPriceRange();
//                 model.setSelected(item.isSelected);
//                 return model;
//             };

//             model.setAmenityID = function (id) {
//                 model.amenityID = id;
//                 return model;
//             };

//             model.setAmenityName = function (name) {
//                 model.amenityName = name;
//                 return model;
//             };

//             model.setAmenitySyndicationName = function (name) {
//                 model.amenitySyndicationName = name;
//                 return model;
//             };

//             model.setTotalProperties = function (prop) {
//                 model.totalProperties = prop;
//                 return model;
//             };

//             model.setMinPrice = function (min) {
//                 model.minPrice = min;
//                 return model;
//             };

//             model.setMaxPrice = function (max) {
//                 model.maxPrice = max;
//                 return model;
//             };

//             model.getPriceRange = function () {
//                 return model.minPrice + "  " + model.maxPrice;
//             };

//             model.setSelected = function (bool) {
//                 model.isSelected = bool;
//                 return model;
//             };

//             model.destroy = function () {
//                 model = undefined;
//             };

//             return model;
//         };
//     }

//     angular
//         .module("ui")
//         .factory("amenitiesListItem", [factory]);
// })(angular);

//  Source: ui\home\floorplan-unit\amenities\js\models\assign-amenities-to-properties.js
//  Amenities List Manager Model

(function (angular) {
    "use strict";

    function factory(slectamenitiesSvc, selectManagerModel, assignPropModel, ameAssignPropAsideManager) {
        var model = {};

        model.init = function () {

            return model;
        };

        model.getSelectData = function (selAmenities) {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            slectamenitiesSvc.getData(params)
                .then(model.setDataFromSvc, model.setDataErr);
        };

        model.setDataFromSvc = function (data) {
            selectManagerModel.setData(data);
            model.setAllData(selectManagerModel.getList());
            model.assignPropertiesToAmenity();
            return model;
        };

        model.getPropertyList = function () {
            return selectManagerModel.getSelectedList();
        };

        model.assignPropertiesToAmenity = function () {
            // assignPropModel.assignPropertiesToAmenity();
            ameAssignPropAsideManager.showAsideModal();
        };

        model.setAllData = function (data) {
            assignPropModel.setAllData(data);
            return model;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("assignAmenitiesToProperties", ["selectAmenityDetailDataSvc", "SelectAmenitiesListManager", "amenityAssignPropModel", "AmenityAssignPropAsideManager", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\models\amenities.js
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

//  Source: ui\home\floorplan-unit\amenities\js\models\select-amenity-data-manager.js
//  Amenities List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function SelectAmenitiesListManager() {
            var s = this;
            s.init();
        }

        var p = SelectAmenitiesListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new SelectAmenitiesListManager();
    }

    angular
        .module("ui")
        .factory("SelectAmenitiesListManager", ["$filter", factory]);
})(angular);



//  Source: ui\home\floorplan-unit\amenities\js\services\amenities-add.js
// Add Amenities Service

(function (angular) {
    "use strict";

    function amenitiesAddSvc($resource, $q, $http) {
        var svc = {},
            url, deferred, actions, defaults = {};

        svc.addAmenity = function (paramData) {
            var url = "/api/add",
                actions = {
                    save: {
                        method: "POST"
                    }
                };
            return $resource(url, defaults, actions);
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("amenitiesAddSvc", [
            "$resource",
            "$q",
            "$http",
            amenitiesAddSvc
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\services\amenities-delete.js
// Delete Amenities Service

(function(angular) {
    "use strict";

    function amenitiesDeleteSvc($q, $http) {
        var svc, url, deferred;

        url = "/api/delete";

        svc = {
            abort: function() {
                if (deferred && deferred.resolve) {
                    deferred.resolve();
                }

                return svc;
            },

            deleteSelectedAmenity: function(paramData) {
                deferred = $q.defer();

                var reqUrl = url + "/" + paramData.amenityID;

                return $http({
                    data: {},
                    url: reqUrl,
                    cache: false,
                    method: "DELETE",
                    timeout: deferred.promise
                });
            }

        };

        return svc;
    }

    angular
        .module("ui")
        .factory("amenitiesDeleteSvc", ["$q", "$http", amenitiesDeleteSvc]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\services\amenities-get.js
//  FloorPlanUnit Amenities Grid Data Service


(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/amenities-list"
        };
        
        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpuAmenitiesDataSvc", ["$resource","$window", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\services\amenities-update.js
// Update Amenities Service

(function (angular) {
    "use strict";

    function amenitiesUpdateSvc($q, $http) {
        var svc, url, deferred;

        url = "/api/update";

        svc = {
            abort: function () {
                if (deferred && deferred.resolve) {
                    deferred.resolve();
                }

                return svc;
            },

            updateAmenity: function (paramData) {
                deferred = $q.defer();

                var reqUrl = url + "/" + paramData.amenityID;

                return $http({
                    data: {},
                    url: reqUrl,
                    cache: false,
                    method: "PUT",
                    timeout: deferred.promise
                });
            }

        };

        return svc;
    }

    angular
        .module("ui")
        .factory("amenitiesUpdateSvc", ["$q", "$http", amenitiesUpdateSvc]);
})(angular);

//  Source: ui\home\floorplan-unit\amenities\js\services\select-amenities.js
//  FloorPlanUnit Amenity Details Grid Data Service


(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/assign-select-amenities"
        };
        
        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("selectAmenityDetailDataSvc", ["$resource","$window", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\properties\js\_bundle.inc
//  Source: ui\home\floorplan-unit\properties\js\controllers\floorplan-unit-properties.js
//  Home Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitPropertiesCtrl($scope) {
        var vm = this;

        vm.init = function () {
            vm.message = "Welcome to Floor Plan Unit Properties";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FloorPlanUnitPropertiesCtrl", ["$scope", FloorPlanUnitPropertiesCtrl]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-details\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-details\js\controllers\amenity-details.js
//  FloorPlanUnit Amenitity Details Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityDetailsCtrl($scope, model, gridConfig, dataSvcGet, managerModel, context, aside) {
        var vm = this;

        vm.init = function () {
            vm.isPageActive = true; 
            gridConfig.setSrc(vm);
            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.loadData();

            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.loadData = function () {
            var amenity = context.get();
            model.setSelectedAmenity(amenity);
            vm.getData();
        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setDataFromSvc, vm.setDataErr);
        };

        model.closeAsideDetail = function () {
            aside.hide();
            vm.isPageActive = false; 
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.assignPropertiesToAmenity = function () {
            model.setAllData(managerModel.getList());
            model.assignPropertiesToAmenity();
        };

        vm.setDataFromSvc = function (data) {
            managerModel.setData(data);
            model.setGridPagination();
            return model;
        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.destroy = function () {
            vm.destWatch();
            // model = undefined;
            // dataSvcGet = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityDetailsCtrl", [
            "$scope",
            "amenityDetailsModel",
            "fpuAmenityDetailsConfig",
            "fpuAmenityDetailDataSvc",
            "AmenitiesListManager",
            "fpuAmenityDetailsContext",
            "fpuAmenityDetailsAside",
            FpuAmenityDetailsCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-details\js\directives\amenity-detail-actions.js
//  Amenity Detail Actions Directive

(function (angular) {
    "use strict";

    function fpuAmenityDetailActions(aside, context) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityDetailActions = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.showPropDetails = function (data) {
                context.set(data);
                aside.show();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("ui")
        .directive("fpuAmenityDetailActions", [
            "fpuAmenityPropDetailsAside",
            "fpuAmenityPropDetailsContext",
            fpuAmenityDetailActions
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-details\js\models\amenity-data-manager.js
//  Amenities List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function AmenitiesListManager() {
            var s = this;
            s.init();
        }

        var p = AmenitiesListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new AmenitiesListManager();
    }

    angular
        .module("ui")
        .factory("AmenitiesListManager", ["$filter", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-details\js\models\amenity-details-config.js
//  FloorPlanUnit Amenity Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "siteName",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/name.html"
                },
                {
                    key: "floorPlans",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/floorplans.html"
                },
                {
                    key: "units",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/units.html"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [

                    {
                        key: "siteName",
                        text: "Name",
                        isSortable: true,
                        className: "site-name"
                    },
                    {
                        key: "floorPlans",
                        text: "Floor Plans",
                        isSortable: true,
                        className: "floor-plans"
                    },
                    {
                        key: "units",
                        text: "Units",
                        isSortable: true,
                        className: "units"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "siteName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Property Name"
                },
                {
                    key: "floorPlans",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Floor Plan Count"
                },
                {
                    key: "units",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Units Count"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-details\js\models\amenity-details.js
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
        .module("ui")
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

//  Source: ui\home\floorplan-unit\amenity-details\js\models\aside.js
//  Amenity Details Aside Model

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-details/templates/index.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-details\js\models\context.js
//  Amenity Details Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsContext", ["modalContext", factory]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-details\js\services\amenities-get.js
//  FloorPlanUnit Amenity Details Grid Data Service


(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/properties-by-amenity"
        };
        
        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailDataSvc", ["$resource","$window", factory]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-details\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-details/templates/floorplans.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-floorPlans\">{{record.floorPlans}}</span></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/index.html",
"<div ng-controller=\"FpuAmenityDetailsCtrl as amenityDetails\" class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-1\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"amenityDetails.isPageActive\"><a ng-click=\"amenityDetails.model.closeAsideDetail()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Amenity Details - {{amenityDetails.model.record.amenityName}}</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-details\" ng-if=\"amenityDetails.isPageActive\"><div class=\"row-detail\"><div class=\"row-detail-head\"><div class=\"grid-col-name\">Name</div><div class=\"grid-col-prop\">Properties</div><div class=\"grid-col-price\">Price</div></div><div class=\"row-detail-body\"><div class=\"grid-col-name\"><span class=\"amenity-name\">{{amenityDetails.model.record.amenityName}}</span><br><span class=\"synd-name\">{{amenityDetails.model.record.amenitySyndicationName}}</span></div><div class=\"grid-col-prop\">{{amenityDetails.model.record.totalProperties}}</div><div class=\"grid-col-price\">{{amenityDetails.model.record.priceRange}}</div></div></div><div class=\"prop-detail\"><div class=\"prop-detail-header-title\">Properties</div><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"amenityDetails.assignPropertiesToAmenity()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Properties</button></div><div class=\"filters\"><div class=\"grid-controls\"><!-- <div class=\"grid-control-item \">\n" +
"                        <i class=\"icon fa fa-th-list \"></i>\n" +
"                    </div>\n" +
"                    <div class=\"grid-control-item \">\n" +
"                        <i class=\"icon fa  fa-th-large icon-color\"></i>\n" +
"                    </div> --><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"amenityDetails.grid.filtersModel.state.active\" options=\"{\n" +
"                                defaultText: 'Filter' ,\n" +
"                                activeIconClass: 'rp-icon-filter',\n" +
"                                defaultIconClass: 'rp-icon-filter active'\n" +
"                            }\"></rp-toggle></div></div></div></div><div class=\"prop-detail-grid\"><rp-grid model=\"amenityDetails.grid\"></rp-grid><rp-grid-pagination model=\"amenityDetails.gridPagination\"></rp-grid-pagination></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/name.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-name\">{{record.siteName}}</span></div>");
$templateCache.put("home/floorplan-unit/amenity-details/templates/units.html",
"<div class=\"grid-col-cursor\" fpu-amenity-detail-actions ng-click=\"amenityDetailActions.showPropDetails(record)\"><span class=\"grid-col-units\">{{record.units}}</span></div>");
}]);

//  Source: ui\home\floorplan-unit\edit-amenity\js\_bundle.inc
//  Source: ui\home\floorplan-unit\edit-amenity\js\controllers\edit-amenity.js
//  Edit Amenity Controller

(function (angular, undefined) {
    "use strict";

    function FpuEditAmenityCtrl($scope, aside, context) {
        var vm = this;

        vm.init = function () {
            vm.amenity = context.get();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuEditAmenityCtrl", [
            "$scope",
            "fpuEditAmenityAside",
            "fpuEditAmenityContext",
            FpuEditAmenityCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\edit-amenity\js\services\aside.js
//  Edit Amenity Aside Service

(function (angular) {
    "use strict";

    function FpuEditAmenityAside(rightAsideModal) {
        var svc = this;

        svc.aside = rightAsideModal("home/floorplan-unit/edit-amenity/templates/index.html");

        svc.show = function () {
            svc.aside.show();
        };

        svc.hide = function () {
            svc.aside.hide();
        };
    }

    angular
        .module("ui")
        .service("fpuEditAmenityAside", [
            "rightAsideModal",
            FpuEditAmenityAside
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\edit-amenity\js\services\context.js
//  Edit Amenity Context Service

(function (angular) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuEditAmenityContext", ["modalContext", factory]);
})(angular);


//  Source: ui\home\floorplan-unit\edit-amenity\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/edit-amenity/templates/index.html",
"<div ng-controller=\"FpuEditAmenityCtrl as editAmenity\" class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-1\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\">Edit Amenity {{editAmenity.amenity}}</div><div class=\"rp-aside-modal-content\"></div></div>");
}]);

//  Source: ui\home\floorplan-unit\amenity-property-details\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-property-details\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-property-details/templates/index.html",
"<div ng-controller=\"FpuAmenityPropDetailsCtrl as propDetails\" class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-1\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"propDetails.isPageActive\"><a ng-click=\"propDetails.closeAsideDetail()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Amenity Details - {{propDetails.selAmenity.amenityName}}</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-prop-details\" ng-if=\"propDetails.isPageActive\"><div class=\"row-head\"><span class=\"left-text\"><i class=\"icon rp-icon-angle-left icon-ext\"></i> <a ng-click=\"propDetails.closeAsideDetail()\">Properties</a> </span><span class=\"center-text\">{{propDetails.model.selectedProperty.siteName}} - {{propDetails.selAmenity.amenityName}}</span></div><div class=\"row-detail\"><div class=\"row-detail-body\"><div class=\"grid-col-img\"><!-- <img ng-src=\"{{propDetails.selAmenity.displayImage}}\" alt=\"{{propDetails.selAmenity.amenityName}}\" /> --> <i class=\"icon rp-icon-photo icon-size\"></i> <span class=\"upload\">Upload</span></div><div class=\"grid-col-name\"><span class=\"amenity-name\">{{propDetails.selAmenity.amenityName}}</span><br><span class=\"synd-name\">{{propDetails.selAmenity.amenitySyndicationName}}</span></div><div class=\"grid-col-prop\"><span class=\"amenity-descTitle\">{{propDetails.selAmenity.marketingName}}</span><br><span class=\"amenity-desc\">{{propDetails.selAmenity.descriptionDetail}}</span></div><!-- ng-click=\"propDetails.selAmenity.isDisplayFlag = !propDetails.selAmenity.isDisplayFlag\" --><div class=\"grid-col-edit\"><span><i class=\"icon rp-icon-visible\" ng-class=\"{'active' : propDetails.selAmenity.isDisplayFlag}\"></i></span></div><div class=\"grid-col-price\">{{propDetails.selAmenity.priceRange}}</div><div class=\"grid-col-more\"><span class=\"rp-actions-menu\" model=\"propDetails.actionsMenu.getMenu()\"></span></div></div></div><div class=\"prop-detail\"><rp-scrolling-tabs-menu class=\"page-tabs\" model=\"propDetails.tabsMenu\"></rp-scrolling-tabs-menu><ng-include src=\"propDetails.getActiveTab()\"></ng-include></div><div class=\"prop-detail-grid\"></div></div></div>");
}]);


//  Source: ui\home\floorplan-unit\amenity-property-details\js\controllers\amenity-property-details.js
//  FloorPlanUnit Amenitity Details Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetailsCtrl(
        $scope,
        model,
        gridConfig,
        dataSvcGet,
        managerModel,
        tabsMenu,
        tabsConfig,
        actionsMenu,
        ameContext) {
        var vm = this;

        vm.init = function () {
            vm.isPageActive = true;
            gridConfig.setSrc(vm);
            vm.actionsMenu = actionsMenu.init(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;

            var tabsData = tabsConfig.getData();
            vm.tabsMenu = tabsMenu().setData(tabsData);
            vm.loadData();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.loadData = function () {
            model.getSelectedProperty();
            vm.getSelectedAmenity();
            vm.getData();
            model.setGridPagination();
        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setDataFromSvc, vm.setDataErr);
        };

        vm.getSelectedAmenity = function () {
            vm.selAmenity = ameContext.get();
        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.edit = function () {
            logc("edit");
        };

        vm.markUndisplayed = function () {
            logc("markUndisplayed");
        };

        vm.assignToFloorPlanUnit = function () {
            logc("assignToFloorPlanUnit");
        };

        vm.removeFromProperty = function () {
            logc("removeFromProperty");
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.assignPropertiesToAmenity = function () {
            logc("Assign Property to Amenity");
            model.setAllData(managerModel.getList());
            model.assignPropertiesToAmenity();
        };

        vm.getActiveTab = function () {
            return tabsConfig.getActiveTab();
        };

        vm.setDataFromSvc = function (data) {
            managerModel.setData(data);
            return model;
        };

        vm.closeAsideDetail = function () {
            model.closeAsideDetail();
            vm.isPageActive = false;
        };

        vm.destroy = function () {
            vm.destWatch();
            // model = undefined;
            // dataSvcGet = undefined;
            // vm.tabsMenu = undefined;
            // vm.tabsConfig = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetailsCtrl", [
            "$scope",
            "amenityPropDetailsModel",
            "fpuAmenityDetailsConfig",
            "fpuAmenityDetailDataSvc",
            "AmenitiesListManager",
            "rpScrollingTabsMenuModel",
            "fpuAmenityDetailsTabsConfig",
            "amenityPropertyActionsMenuModel",
            "fpuAmenityDetailsContext",
            FpuAmenityPropDetailsCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-property-details\js\models\amenity-property-details.js
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

//  Source: ui\home\floorplan-unit\amenity-property-details\js\models\amenity-property-details-tabs-config.js
//  Amenity Property DetailsTabs  Config

(function (angular) {
    "use strict";

    function factory() {
        var model = {};

        model.data = [
            {
                id: "01",
                isActive: true,
                text: "Floor Plans",
                url: "floorplans"
            },
            {
                id: "02",
                isActive: false,
                text: "Units",
                url: "units"
            },
            {
                id: "03",
                isActive: false,
                text: "Price Points",
                url: "pricepoints"
            }
        ];

        model.getData = function () {
            return model.data;
        };

        model.getActiveTab = function () {
            var url;

            model.data.forEach(function (tab) {
                if (tab.isActive) {
                    url = tab.url;
                }
            });

            return "home/floorplan-unit/amenity-property-details-" + url + "/templates/" + url + "-tab.html";
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsTabsConfig", [factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details\js\models\aside.js
//  Amenity Property Details Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-property-details/templates/index.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details\js\models\context.js
//  Amenity Property Details Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsContext", ["modalContext", factory]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-property-details\js\models\amenity-property-actions-menu.js
//   Actions Menu amenity property  Model

(function (angular) {
    "use strict";

    function factory(actionsMenu) {
        var model = {
            src: {}
        };

        model.init = function (src) {
            model.src = src;
            return model;
        };

        model.getMenu = function () {
            return actionsMenu({
                actions: [
                    {
                        text: "Edit",
                        method: model.src.edit
                    },
                    {                        
                        text: "Mark as Undisplayed",
                        method: model.src.markUndisplayed
                    },
                    {                        
                        text: "Assign to Floor Plan / Unit",
                        method: model.src.assignToFloorPlanUnit
                    },
                    {                        
                        text: "Remove from Property",
                        method: model.src.removeFromProperty
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "rp-actions-menu-panel floorplan-actionsmenu"
            });
        };
        

        return model;
    }

    angular
        .module("ui")
        .factory("amenityPropertyActionsMenuModel", ["rpActionsMenuModel", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\assign-property\js\_bundle.inc
//  Source: ui\home\floorplan-unit\assign-property\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/assign-property/templates/assign-property-aside.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FloorPlanUnitAmenityAssignPropCtrl as fpaPropCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"fpaPropCtrl.isPageActive\"><a ng-click=\"fpaPropCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign Properties</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-assign-prop\" ng-if=\"fpaPropCtrl.isPageActive\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaPropCtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaPropCtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaPropCtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaPropCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaPropCtrl.assign()\" class=\"btn rounded primary pad-left\">Assign</button></div></div>");
}]);


//  Source: ui\home\floorplan-unit\assign-property\js\controllers\assign-property.js
//  FloorPlanUnit Amenitity Details Controller

(function (angular, undefined) {
    "use strict";

    function FloorPlanUnitAmenityAssignPropCtrl($scope, pubsub, model, gridConfig, dataSvcGet, managerModel, ameAssignPropAsideManager) {
        var vm = this;

        vm.init = function () {
            vm.isPageActive = true; 
            gridConfig.setSrc(vm);
            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            model.assignPropertiesToAmenity();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.resetGridFilters = function () {
            model.resetGridFilters();
        };

        vm.closeAside = function () {
            model.reset();
            // model.closeAside();
            ameAssignPropAsideManager.hideModal();
            vm.isPageActive = false; 
        };

        vm.assign = function () {
            managerModel.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedList");
            ameAssignPropAsideManager.hideModal();
        };

        vm.destroy = function () {
            vm.destWatch();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FloorPlanUnitAmenityAssignPropCtrl", [
            "$scope",
            "pubsub",
            "amenityAssignPropModel",
            "floorPlanUnitAmenityAssignPropConfig",
            "floorPlanUnitAmenityAssignPropDataSvc",
            "AmenitiesListManager",
            "AmenityAssignPropAsideManager",
            FloorPlanUnitAmenityAssignPropCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\assign-property\js\models\assign-property.js
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

//  Source: ui\home\floorplan-unit\assign-property\js\models\assign-property-config.js
//  FloorPlanUnit Amenity Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "siteID"
                },
                {
                    key: "siteName"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",
                        className: "is-selected",
                        type: "select",
                        enabled: true
                    },
                    {
                        key: "siteName",
                        text: "Property",
                        className: "site-name"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "siteID"
                },
                {
                    key: "siteName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Property Name"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlanUnitAmenityAssignPropConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\assign-property\js\models\assign-property-aside-manager.js
//  Amenities Assign Prop aside Manager Model

(function (angular, undefined) {
    "use strict";

    function factory(asideModal) {
        function AmenityAssignPropAsideManager() {
            var s = this;
            s.isLoadedFlag = false;
            s.init();
        }

        var p = AmenityAssignPropAsideManager.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            s.asideDetail = asideModal;
            
            if (!s.isLoadedFlag) {
                s.isLoadedFlag = true;
                s.asideDetail.loadAside();
            }

        };

        // Getters

        p.showAsideModal = function () {
            var s = this;
            s.asideDetail.showAsideModal();
            return s;
        };

        p.hideModal = function () {
            var s = this;
            s.asideDetail.hideModal();
            return s;
        };

        // Setters

        p.setAmenData = function (data) {
            var s = this;
            s.data = data;
            return s;
        };

        p.getAmenData = function () {
            var s = this;
            return s.data;
        };

        p.reset = function () {
            var s = this;
            s.data = {};
        };

        return new AmenityAssignPropAsideManager();
    }

    angular
        .module("ui")
        .factory("AmenityAssignPropAsideManager", ["AmenityAssignPropAsideModel", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\assign-property\js\models\assign-property-aside-model.js
//  Amenities List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($aside) {
        function AmenityAssignPropAsideModel() {
            var s = this;
            s.init();
        }

        var p = AmenityAssignPropAsideModel.prototype;

        p.init = function () {
            var s = this;
            s.asideDetail = {};
        };

        
        p.loadAside = function () {
            logc("prop assign aside  loaded");
            var s = this;
            
            s.asideAssignPropModal = $aside({
                backdrop: true,
                show: false,
                animation: "am-fade-and-slide-right",
                placement: "right",
                templateUrl: "home/floorplan-unit/assign-property/templates/assign-property-aside.html"
            });

            return s;
        };

        
        p.showAsideModal = function () {
            var s = this;
            s.asideAssignPropModal.$promise.then(function () {
                s.asideAssignPropModal.show();
            });
            return s;
        };

        p.hideModal = function () {
            var s = this;
            s.asideAssignPropModal.$promise.then(function () {
                s.asideAssignPropModal.hide();
            });
            return s;
        };

        p.reset = function () {
            var s = this;
            s.isLoadedFlag = false;
        };

        return new AmenityAssignPropAsideModel();
    }

    angular
        .module("ui")
        .factory("AmenityAssignPropAsideModel", ["$aside", factory]);
})(angular);



//  Source: ui\home\floorplan-unit\assign-property\js\services\assign-property-get.js
//  FloorPlanUnit Amenity Details Grid Data Service

(function (angular) {
    "use strict";

    function factory($resource) {
        return $resource("/api/floorplan-unit/properties-by-amenity", {}, {
            get: {
                method: "GET",
                cancellable: true
            }
        });
    }

    angular
        .module("ui")
        .factory("floorPlanUnitAmenityAssignPropDataSvc", ["$resource", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-property-details-floorplans/templates/amenity-added-delete-template.html",
"<div fpu-amenity-prop-details-flr-pln-actions><a ng-click=\"amenityPropDetailsFlrPlns.deleteAmeAddFlrPlan(record)\"><i class=\"action-icon rp-icon-delete\"></i></a></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-floorplans/templates/floorplans-tab.html",
"<div class=\"floorplan-amenity-prop-details-floorplans\" ng-controller=\"FpuAmenityPropDetFloorPlansCtrl as fpuAmePropDetFloorplans\"><div class=\"btn-tabs\"><rp-tabs-menu model=\"fpuAmePropDetFloorplans.tabsMenuModel.tabsMenu\"></rp-tabs-menu></div><div class=\"\" ng-if=\"fpuAmePropDetFloorplans.tabsMenuModel.tabsDataModel.floorPlanAmenityAdded.isActive\"><div class=\"amenity-tab\"><div class=\"rp-action-bar box\"><div rp-grid-model=\"fpuAmePropDetFloorplans.grid\" class=\"action-item rp-grid-select ft-form\"><label class=\"md-check dark-bluebox rp-grid-select-label\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"gridSelect.model.selected\" ng-change=\"gridSelect.model.publishState()\"> <i class=\"primary\"></i></label><span class=\"rp-grid-select-icon rp-icon-angle-down\"></span></div><button class=\"action-item\" ng-click=\"fpuAmePropDetFloorplans.showDeleteFloorplanModal()\"><i class=\"action-icon rp-icon-trash\"></i> <span class=\"action-text\">Remove</span></button></div><div class=\"actions-row\"><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"fpuAmePropDetFloorplans.assignFloorplan()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Floor Plan</button></div><div class=\"filters\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"fpuAmePropDetFloorplans.grid.filtersModel.state.active\" options=\"{\n" +
"                                                        defaultText: 'Filter' ,\n" +
"                                                        defaultIconClass: 'rp-icon-filter active',\n" +
"                                                        activeIconClass: 'rp-icon-filter'\n" +
"                                                    }\"></rp-toggle></div></div></div></div><div class=\"ameneties-grid\"><rp-grid model=\"fpuAmePropDetFloorplans.grid\"></rp-grid><rp-grid-pagination model=\"fpuAmePropDetFloorplans.gridPagination\"></rp-grid-pagination></div></div></div><div class=\"tab-content\" ng-if=\"fpuAmePropDetFloorplans.tabsDataModel.floorPlanUpgradeEligible.isActive\"><div class=\"upgrade-eligible-tab\"><div class=\"rp-action-bar box\"><div rp-grid-model=\"fpuAmePropDetFloorplans.gridUpgEli\" class=\"action-item rp-grid-select ft-form\"><label class=\"md-check dark-bluebox rp-grid-select-label\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"gridSelect.model.selected\" ng-change=\"gridSelect.model.publishState()\"> <i class=\"primary\"></i></label><span class=\"rp-grid-select-icon rp-icon-angle-down\"></span></div><button class=\"action-item\" ng-click=\"fpuAmePropDetFloorplans.showDeleteUpgradeEligibleModal()\"><i class=\"action-icon rp-icon-trash\"></i> <span class=\"action-text\">Remove</span></button></div><div class=\"actions-row\"><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"fpuAmePropDetFloorplans.assignUpgradeEligible()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Floor Plan</button></div><div class=\"filters\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"fpuAmePropDetFloorplans.gridUpgEli.filtersModel.state.active\" options=\"{\n" +
"                                                        defaultText: 'Filter' ,\n" +
"                                                        defaultIconClass: 'rp-icon-filter active',\n" +
"                                                        activeIconClass: 'rp-icon-filter'\n" +
"                                                    }\"></rp-toggle></div></div></div></div><div class=\"ameneties-grid\"><rp-grid model=\"fpuAmePropDetFloorplans.gridUpgEli\"></rp-grid><rp-grid-pagination model=\"fpuAmePropDetFloorplans.gridPaginationUpgEli\"></rp-grid-pagination></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-floorplans/templates/remove-floorplans-property.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Floorplan</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrl.model.floorPlanNames}} from the property’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteSelectedFloorPlans()\">Remove</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-floorplans/templates/remove-upgrade-eligible-property.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Upgrade Eligible</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrlUE.model.floorPlanNames}} from the property’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrlUE.hideModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrlUE.confirmDeleteSelectedAmenities()\">Remove</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-floorplans/templates/upgrade-eligible-delete-template.html",
"<div fpu-amenity-prop-details-flr-pln-actions><a ng-click=\"amenityPropDetailsFlrPlns.deleteUpgEliFlrPlan(record)\"><i class=\"action-icon rp-icon-delete\"></i></a></div>");
}]);



//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\controllers\floorplan-unit-amenity-prop-detail-floorplans.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetFloorPlansCtrl(
        $scope, 
        tabsMenuModel, 
        dataSvcGet, 
        model, 
        gridConfig, 
        dataSvcDel,         
        addFloorPlanModel, 
        addFloorPlanManager, 
        pubsub, 
        upgradeEligibleManager, 
        upgradeEligibleModel, 
        upgradeEligibleListModel ,
        flrPlnAside, 
        flrPlnContext ,
        flrPlnUpgEliAside, 
        flrPlnUpgEliContext) {
        var vm = this;

        vm.init = function () {
            // gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;

            vm.modelUpgEli = upgradeEligibleListModel;
            vm.gridUpgEli = upgradeEligibleListModel.grid;
            vm.gridPaginationUpgEli = upgradeEligibleListModel.gridPagination;

            vm.tabsMenuModel = tabsMenuModel.init();
            vm.tabsDataModel = tabsMenuModel.tabsDataModel;

            vm.loadData();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

             vm.tabsMenuChange =  tabsMenuModel.subscribe(vm.tabChange);
        };

        vm.loadData = function () {
            vm.getData();
        };

        vm.assignFloorplan = function () {
            logc("assign floor plan");
            addFloorPlanModel.setGridPagination();
            flrPlnAside.show();
        };

        vm.assignUpgradeEligible = function () {
            logc("assign Upgrade Eligible");
            upgradeEligibleModel.setGridPagination();
            flrPlnUpgEliAside.show();
        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setData, vm.setDataErr);
        };

        vm.setData = function (data) {
            logc("data from svc2");
            vm.setAddedAmenities(data);
            vm.setUpgradeEligible(data);

        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.setUpgradeEligible = function (data) {
            var upgradeEligible = {
                records: data.floorPlans.upgradeEligible
            };

            upgradeEligibleManager.setData(upgradeEligible);            
            upgradeEligibleListModel.setGridPagination();
        };

        vm.setAddedAmenities = function (data) {
            var addedAmenities = {
                records: data.floorPlans.addedAmenities
            };

            addFloorPlanManager.setData(addedAmenities);            
            model.setGridPagination();
        };

        vm.showDeleteFloorplanModal = function () {
            model.setSelectedFloorPlansForDisplay();
            if (model.isFloorPlansSelected) {
                model.showFloorplanModal();
            }
        };

        vm.showDeleteUpgradeEligibleModal = function () {
            upgradeEligibleListModel.setSelectedUpgradeEligibleFloorPlanForDisplay();
            if (upgradeEligibleListModel.isUpgradeEligibleFloorPlansSelected) {
                upgradeEligibleListModel.showFloorplanModal();
            }
        };

        vm.tabChange = function () {
            logc(tabsMenuModel);
            tabsMenuModel.tabsData.forEach(function (item) {
                if(item.isActive )
                {
                    if(item.name == "AmenityAdded"){
                        model.setGridPagination();
                    }else{
                        upgradeEligibleListModel.setGridPagination();
                    }
                }
            });
        };

        vm.hideModal = function () {
            model.hideModal();
        };

        vm.confirmDeleteSelectedAmenities = function () {
            logc("Confirmed Delete");
            vm.hideModal();
            model.deleteSelectedFloorplans();
        };

        vm.destroy = function () {
            vm.destWatch();
            // tabsMenuModel.reset();

            // vm.grid = undefined;
            // vm.gridPagination = undefined;
            // vm.tabsMenuModel = undefined;
            // vm.tabsDataModel = undefined;
            // vm.changeWatch();
            

            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetFloorPlansCtrl", [
            "$scope",
            "fpuAmenityPropDetTabsMenuModel",
            "fpDataSvc",
            "fpAmenityAddedModel",
            "fpAmenityAddedConfig",
            "fpAmenityAddedDeleteSvc",            
            "fpAmenityAddFloorPlansModel",
            "AddFloorPlanListManager",
            "pubsub",
            "UpgradeEligibleListManager",
            "fpAmenityUpgradeEligibleModel",
            "fpUpgradeEligibleListModel",
            "fpuAmenityPropDetailsFlrPlnAssignAside",
            "fpuAmenityPropDetailsFlrPlnAssignContext",
            "fpuAmenityPropDetailsFlrPlnUpgEliAssignAside",
            "fpuAmenityPropDetailsFlrPlnUpgEliAssignContext",
            FpuAmenityPropDetFloorPlansCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\controllers\floorplan-unit-amenity-prop-detail-floorplans-modal.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetFloorPlansModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideModal = function () {
            model.hideModal();
        };

        vm.confirmDeleteSelectedFloorPlans = function () {
            logc("Confirmed Delete");
            vm.hideModal();            
            model.deleteSelectedFloorplans();
        };

        vm.selectedFloorPlansForDisplay = function () {
            
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetFloorPlansModalCtrl", [
            "$scope",
            "fpAmenityAddedModel",
            FpuAmenityPropDetFloorPlansModalCtrl
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\controllers\floorplan-unit-amenity-prop-detail-upgrade-eligible-modal.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUpgradeEligibleModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideModal = function () {
            model.hideModal();
        };

        vm.confirmDeleteSelectedAmenities = function () {
            logc("Confirmed Delete");
            vm.hideModal();            
            model.deleteSelectedupgradeEligibleFloorPlan();            
        };

        vm.selectedFloorPlansForDisplay = function () {
            
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetUpgradeEligibleModalCtrl", [
            "$scope",
            "fpUpgradeEligibleListModel",
            FpuAmenityPropDetUpgradeEligibleModalCtrl
        ]);
})(angular);




//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\directives\amenity-prop-detail-floorplans-actions.js
//  Amenity Prop Detail floorplans Actions Directive

(function (angular) {
    "use strict";

    function fpuAmenityPropDetailsFlrPlnActions(model,upgEliModel) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityPropDetailsFlrPlns = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.deleteAmeAddFlrPlan = function (data) {
                logc("New Delete",data);
                model.amAddFloorPlanDelete(data);                
            };

            dir.deleteUpgEliFlrPlan = function (data) {
                logc("New Delete",data);
                upgEliModel.upgradeEligibleFloorPlanDelete(data);                
            };
                       
            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("ui")
        .directive("fpuAmenityPropDetailsFlrPlnActions", [
            "fpAmenityAddedModel",
            "fpUpgradeEligibleListModel",            
            fpuAmenityPropDetailsFlrPlnActions
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-tab-menu-config.js
//  Floorplan unit amenities tab menu Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.floorPlanAmenityAdded = {
            id: "01",
            isActive: true,
            text: "Amenity Added",
            name: "AmenityAdded"
        };

        model.floorPlanUpgradeEligible = {
            id: "02",
            isActive: false,
            text: "Upgrade Eligible",
            name: "UpgradeEligible"
        };

        model.getData = function () {
            return [
            	model.floorPlanAmenityAdded, model.floorPlanUpgradeEligible
            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlanUnitAmenityPropDetTabsMenuConfigModel", [factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-tab-menu.js
//  Floorplan Unit Property Detail Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsMenuModel, tabsMenuDataModel) {
        var model = {};

        model.init = function () {
            model.tabsMenu = tabsMenuModel();
            model.tabsDataModel = tabsMenuDataModel;
            model.tabsData = tabsMenuDataModel.getData();
            model.tabsMenu.setOptions(model.tabsData);

            return model;
        };

        model.getData = function () {
            return model.tabsData;
        };

        model.subscribe = function (fn) {
            model.tabsMenu.subscribe("change", fn);
        };

        model.reset = function () {
            model.tabsMenu.destroy();
            model.tabsData = undefined;
            model.tabsMenu = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetTabsMenuModel", ["rpTabsMenuModel", "floorPlanUnitAmenityPropDetTabsMenuConfigModel", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-amenity-added-list-config.js
//  FloorPlan Unit Amenities Amenity AddedConfig Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                },
                {
                    key: "dateAdded"
                },
                {
                    key: "delete",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-property-details-floorplans/templates/amenity-added-delete-template.html"                                     
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "floorPlanId",
                    },
                    {
                        key: "floorplanName",
                        text: "Floor Plan",
                        isSortable: true,
                    },
                    {
                        key: "dateAdded",
                        text: "Added",
                        isSortable: true,
                    },
                    {
                         key: "delete",
                         className: "delete"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "floorPlanId",
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan name"
                },
                {
                    key: "dateAdded",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by date added"
                },
                {
                    key: "delete"
               }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpAmenityAddedConfig", [
            "rpGridConfig",            
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-amenity-added.js
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
        .module("ui")
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



//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-upgrade-eligible-list-config.js
//  FloorPlan Unit Amenities Upgrade eligible Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                },                
                {
                    key: "delete",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-property-details-floorplans/templates/upgrade-eligible-delete-template.html"                    
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "floorPlanId",
                    },
                    {
                        key: "floorplanName",
                        text: "Floor Plan",
                        isSortable: true,
                    },                    
                    {
                        key: "delete",
                        className: "delete"                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "floorPlanId",
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan name"
                },                
                {
                    key: "delete"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlansUpgradeEligibleConfig", [
            "rpGridConfig",            
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\floorplans-upgrade-eligible.js
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
        .module("ui")
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





//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\add-floorplan-list-manager.js
//  Add Floorplans List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function AddFloorPlanListManager() {
            var s = this;
            s.init();
        }

        var p = AddFloorPlanListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };

        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new AddFloorPlanListManager();
    }

    angular
        .module("ui")
        .factory("AddFloorPlanListManager", ["$filter", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\models\upgrade-eligible-list-manager.js
//  Add Floorplans List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function UpgradeEligibleListManager() {
            var s = this;
            s.init();
        }

        var p = UpgradeEligibleListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };

        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new UpgradeEligibleListManager();
    }

    angular
        .module("ui")
        .factory("UpgradeEligibleListManager", ["$filter", factory]);
})(angular);







//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\services\floorplans-amenity-added-floorplans-delete.js
// Delete FloorPlanUnit Amenity Prop detail FloorPlans Service

(function (angular) {
    "use strict";

    function floorPlansAmenityAddedDeleteSvc($q, $http) {
        var svc, url, deferred;

        url = "/api/delete";

        svc = {
            abort: function () {
                if (deferred && deferred.resolve) {
                    deferred.resolve();
                }

                return svc;
            },

            deleteSelectedAmenity: function (paramData) {
                deferred = $q.defer();

                var reqUrl = url + "/" + paramData.amenityID;

                return $http({
                    data: {},
                    url: reqUrl,
                    cache: false,
                    method: "DELETE",
                    timeout: deferred.promise
                });
            }
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpAmenityAddedDeleteSvc", ["$q", "$http", floorPlansAmenityAddedDeleteSvc]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-floorplans\js\services\floorplans-amenity-added-floorplans-get.js
//  FloorPlanUnit Amenity Prop detail FloorPlans Data Service

(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/amenity-property-detail-floorplans"
        };
        // /api/floorplan-unit/amenity-property-detail-floorplans/:propID/:PMCID

        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpDataSvc", ["$resource","$window", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-property-details-units/templates/remove-amenityadd-unit.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">Delete Unit</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrl.model.units}} from the property’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrl.hideConfirmModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrl.confirmDeleteSelectedUnits()\">Remove</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-units/templates/remove-upgrade-eligible-unit.html",
"<div class=\"modal\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><h5 class=\"modal-title\">remove Upgrade Eligible Unit</h5></div><div class=\"modal-body p-lg\"><p>You are about to remove {{ctrlUPgEli.model.units}} from the property’s list. It will no longer be listed for your property or available to assign to floor plans /units.</p></div><div class=\"modal-footer text-center\"><button type=\"button\" class=\"btn rounded neutral p-x-md\" ng-click=\"ctrlUPgEli.hideConfirmUpgEliModal()\">Cancel</button> <button type=\"button\" class=\"btn rounded primary p-x-md\" ng-click=\"ctrlUPgEli.confirmDeleteSelectedUpgEliUnits()\">Remove</button></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-units/templates/units-tab.html",
"<div class=\"floorplan-amenity-prop-details-units\" ng-controller=\"FpuAmenityPropDetUnitsCtrl as fpuAmePropDetUnits\"><div class=\"btn-tabs\"><rp-tabs-menu model=\"fpuAmePropDetUnits.tabsMenuModel.tabsMenu\"></rp-tabs-menu></div><div class=\"\" ng-if=\"fpuAmePropDetUnits.tabsMenuModel.tabsDataModel.unitsAmenityAdded.isActive\"><div class=\"amenity-tab\"><div class=\"rp-action-bar box\"><div rp-grid-model=\"fpuAmePropDetUnits.grid\" class=\"action-item rp-grid-select ft-form\"><label class=\"md-check dark-bluebox rp-grid-select-label\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"gridSelect.model.selected\" ng-change=\"gridSelect.model.publishState()\"> <i class=\"primary\"></i></label><span class=\"rp-grid-select-icon rp-icon-angle-down\"></span></div><button class=\"action-item\" ng-click=\"fpuAmePropDetUnits.showDeleteFloorplanModal()\"><!-- <i class=\"action-icon rp-icon-trash\"></i> --> <span class=\"action-text\">Remove</span></button> <button class=\"action-item\" ng-click=\"fpuAmePropDetUnits.changePricePointModalBulk()\"><span class=\"action-text\">Change Price Point</span></button></div><div class=\"actions-row\"><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"fpuAmePropDetUnits.assignAmeAddedUnit()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Unit</button></div><div class=\"filters\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"fpuAmePropDetUnits.grid.filtersModel.state.active\" options=\"{\n" +
"                                                        defaultText: 'Filter' ,\n" +
"                                                        defaultIconClass: 'rp-icon-filter active',\n" +
"                                                        activeIconClass: 'rp-icon-filter'\n" +
"                                                    }\"></rp-toggle></div></div></div></div><div class=\"ameneties-grid\"><rp-grid model=\"fpuAmePropDetUnits.grid\"></rp-grid><rp-grid-pagination model=\"fpuAmePropDetUnits.gridPagination\"></rp-grid-pagination></div></div></div><div class=\"tab-content\" ng-if=\"fpuAmePropDetUnits.tabsDataModel.unitsUpgradeEligible.isActive\"><div class=\"upgrade-eligible-tab\"><div class=\"rp-action-bar box\"><div rp-grid-model=\"fpuAmePropDetUnits.gridUpgElig\" class=\"action-item rp-grid-select ft-form\"><label class=\"md-check dark-bluebox rp-grid-select-label\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"gridSelect.model.selected\" ng-change=\"gridSelect.model.publishState()\"> <i class=\"primary\"></i></label><span class=\"rp-grid-select-icon rp-icon-angle-down\"></span></div><button class=\"action-item\" ng-click=\"fpuAmePropDetUnits.showDeleteUpgradeEligibleModal()\"><!-- <i class=\"action-icon rp-icon-trash\"></i> --> <span class=\"action-text\">Remove</span></button></div><div class=\"actions-row\"><div class=\"new-btn\"><button class=\"btn rounded primary\" ng-click=\"fpuAmePropDetUnits.assignUpgEliUnit()\"><i class=\"fa fa-fw fa-plus icon-size\"></i> Assign Unit</button></div><div class=\"filters\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><i class=\"icon rp-icon-printer\"></i> <span class=\"text\">Print</span></div><div class=\"grid-control-item\"><rp-toggle model=\"fpuAmePropDetUnits.gridUpgElig.filtersModel.state.active\" options=\"{\n" +
"                                                        defaultText: 'Filter' ,\n" +
"                                                        defaultIconClass: 'rp-icon-filter active',\n" +
"                                                        activeIconClass: 'rp-icon-filter'\n" +
"                                                    }\"></rp-toggle></div></div></div></div><div class=\"ameneties-grid\"><rp-grid model=\"fpuAmePropDetUnits.gridUpgElig\"></rp-grid><rp-grid-pagination model=\"fpuAmePropDetUnits.gridPaginationUpgElig\"></rp-grid-pagination></div></div></div></div>");
$templateCache.put("home/floorplan-unit/amenity-property-details-units/templates/upgrade-eligible-delete-template.html",
"<div fpu-amenity-prop-details-units-actions><a ng-click=\"amenityPropDetailsUnits.deleteUpgEliUnit(record)\"><i class=\"action-icon rp-icon-delete\"></i></a></div>");
}]);



//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\controllers\amenity-prop-detail-units.js
//  Floorplan unit amenities  Property Details Units Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUnitsCtrl(
        $scope,
        tabsMenuModel,
        dataSvcGet,
        model,
        gridConfig,
        $timeout,
        addFloorPlanModel,
        addFloorPlanManager,
        pubsub,
        upgradeEligibleManager,
        upgradeEligibleModel,
        upgradeEligibleListModel,
        gridConfigUpgEli,
        asideUnitManager,
        asideUnitUpgEliManager,
        gridActions,
        gridActionsUpgEli,
        pricePointContext,
        pricePointAside,
        pricePointBulk
    ) {
        var vm = this;

        vm.init = function () {
            // vm.isPageActive = true;   
            gridConfig.setSrc(vm);
            gridActions.setSrc(vm);

            gridConfigUpgEli.setSrc(vm);
            gridActionsUpgEli.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;

            vm.modelUpgElig = upgradeEligibleListModel;
            vm.gridUpgElig = upgradeEligibleListModel.grid;
            vm.gridPaginationUpgElig = upgradeEligibleListModel.gridPagination;

            vm.tabsMenuModel = tabsMenuModel.init();
            vm.tabsDataModel = tabsMenuModel.tabsDataModel;

            vm.loadData();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

            vm.tabsMenuChange = tabsMenuModel.subscribe(vm.tabChange);
        };

        vm.loadData = function () {
            vm.getData();
        };

        vm.assignAmeAddedUnit = function () {
            logc("assign unit  Amenity Added");
            asideUnitManager.show();

        };

        vm.assignUpgEliUnit = function () {
            logc("assign unit  Upgrade Eligible");
            asideUnitUpgEliManager.show();

        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setData, vm.setDataErr);
        };

        vm.setData = function (data) {
            logc("data from units svc");

            vm.setAddedAmenities(data);
            vm.setUpgradeEligible(data);

        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.setUpgradeEligible = function (data) {
            var upgradeEligible = {
                records: data.units.upgradeEligible
            };

            upgradeEligibleManager.setData(upgradeEligible);
            upgradeEligibleListModel.setGridPagination();
        };

        vm.setAddedAmenities = function (data) {
            var addedAmenities = {
                records: data.units.addedAmenities
            };

            addFloorPlanManager.setData(addedAmenities);
            model.setGridPagination();
        };

        vm.showDeleteFloorplanModal = function () {
            model.setSelectedUnitsForDisplay();
            if (model.isUnitsSelected) {
                model.showUnitsModal();
            }
        };

        vm.changePricePointModal = function (record) {
            logc("Change Price Point");

            pricePointBulk.isPricePointBulk = false;
            // pricePointBulk.setSelUnits(record.unitNo);
            pricePointContext.set(record);
            pricePointAside.show();
        };

        vm.changePricePointModalBulk = function () {
            model.getSelectedUnitNosForDisplay();
            if (model.isUnitsSelectedDisplay) {
                pricePointBulk.isPricePointBulk = true;
                pricePointBulk.setSelUnits(model.unitNos);
                var selUnitsList = model.getSelectedRecords();
                pricePointContext.set(selUnitsList);
                pricePointAside.show();
            }

        };

        vm.removeUnit = function (record) {
            logc("remove Unit");
            model.unitRemove(record);
        };

        vm.showDeleteUpgradeEligibleModal = function () {
            logc("set");
            upgradeEligibleListModel.setSelectedUpgradeEligibleUnitsForDisplay();
            if (upgradeEligibleListModel.isUpgradeEligibleUnitsSelected) {
                upgradeEligibleListModel.showUnitsModal();
            }
        };

        vm.tabChange = function () {
            logc(tabsMenuModel);
            tabsMenuModel.tabsData.forEach(function (item) {

                if (item.isActive) {
                    if (item.name == "AmenityAdded") {
                        // model.setGridPagination();
                        logc("AmenityAdded");
                    }
                    else {
                        // upgradeEligibleListModel.setGridPagination();
                        logc("upgradeEligible");
                    }
                }
            });
        };

        vm.hideConfirmModal = function () {
            model.hideConfirmModal();
        };
        vm.hideConfirmUpgAmiModal = function () {
            upgradeEligibleListModel.hideConfirmModal();
        };

        vm.confirmDeleteSelectedUpgEliUnits = function () {
            logc("Confirmed Delete");
            vm.hideConfirmUpgAmiModal();
            upgradeEligibleListModel.deleteSelectedupgradeEligibleUnits();
        };

        vm.destroy = function () {
            vm.destWatch();
            // tabsMenuModel.reset();

            // vm.grid = undefined;
            // vm.gridPagination = undefined;
            // vm.tabsMenuModel = undefined;
            // vm.tabsDataModel = undefined;
            // vm.changeWatch();

            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetUnitsCtrl", [
            "$scope",
            "fpuAmenityPropDetUnitsTabsMenuModel",
            "unitsDataSvc",
            "unitsAmenityAddedModel",
            "unitsAmenityAddedConfig",
            "$timeout",
            "floorPlansAmenityAddunitsModel",
            "AddUnitsListManager",
            "pubsub",
            "UnitsUpgradeEligibleListManager",
            "unitsAmenityUpgradeEligibleModel",
            "unitsUpgradeEligibleListModel",
            "unitsUpgradeEligibleConfig",
            "fpuAmenityPropDetailsUnitAssignAside",
            "fpuAmenityPropDetailsUnitUpgEliAssignAside",
            "fpuAmePropDetUnitsAmeAddActionsConfig",
            "fpuAmePropDetUnitsUpgEliActionsConfig",
            "fpuAmenityPropDetailsUnitsPricePointContext",
            "fpuAmenityPropDetailsUnitsPricePointAside",
            "fpuPropDetUnitsPricePointBulkModel",
            FpuAmenityPropDetUnitsCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\controllers\amenity-prop-detail-units-upgrade-eligible-modal.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUnitsUpgEliModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideConfirmUpgEliModal = function () {
            model.hideConfirmModal();
        };

        vm.confirmDeleteSelectedUpgEliUnits = function () {
            logc("Confirmed Delete");
            vm.hideConfirmUpgEliModal();            
            model.deleteSelectedupgradeEligibleUnits();            
        };

        // vm.selectedFloorPlansForDisplay = function () {
            
        // };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetUnitsUpgEliModalCtrl", [
            "$scope",
            "unitsUpgradeEligibleListModel",
            FpuAmenityPropDetUnitsUpgEliModalCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\controllers\amenity-prop-detail-units-confirm-modal.js
//  Floorplan unit amenities  Property Details Units Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUnitsConfirmModalCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
            vm.model = model;           
        };

        vm.hideConfirmModal = function () {
            model.hideConfirmModal();
        };

        vm.confirmDeleteSelectedUnits = function () {
            logc("Confirmed Delete");
            vm.hideConfirmModal();            
            model.deleteSelectedAmeAddUnits();
        };

        vm.selectedFloorPlansForDisplay = function () {
            
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetUnitsConfirmModalCtrl", [
            "$scope",
            "unitsAmenityAddedModel",
            FpuAmenityPropDetUnitsConfirmModalCtrl
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\directives\amenity-prop-details-units-actions.js
//  Amenity Prop Detail Units Actions Directive

(function (angular) {
    "use strict";

    function fpuAmenityPropDetailsUnitsActions(pricePointAside, pricePointContext, ameAddModel, upgEliModel, pricePointBulk) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityPropDetailsUnits = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.showPricePoint = function (data) {
                logc(data);
                pricePointBulk.isPricePointBulk = false;
                pricePointContext.set(data);
                pricePointAside.show();
            };

            dir.deleteUpgEliUnit = function (data) {
                logc("New Delete",data);
                upgEliModel.unitRemove(data);                
            };

           
            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("ui")
        .directive("fpuAmenityPropDetailsUnitsActions", [
            "fpuAmenityPropDetailsUnitsPricePointAside",
            "fpuAmenityPropDetailsUnitsPricePointContext",
            "unitsAmenityAddedModel",
            "unitsUpgradeEligibleListModel",
            "fpuPropDetUnitsPricePointBulkModel",
            fpuAmenityPropDetailsUnitsActions
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-tab-menu.js
//  Floorplan Unit Property Detail Units Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsMenuModel, tabsMenuDataModel) {
        var model = {};

        model.init = function () {
            model.tabsMenu = tabsMenuModel();
            model.tabsDataModel = tabsMenuDataModel;
            model.tabsData = tabsMenuDataModel.getData();
            model.tabsMenu.setOptions(model.tabsData);

            return model;
        };

        model.getData = function () {
            return model.tabsData;
        };

        model.subscribe = function (fn) {
            model.tabsMenu.subscribe("change", fn);
        };

        model.reset = function () {
            model.tabsMenu.destroy();
            model.tabsData = undefined;
            model.tabsMenu = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetUnitsTabsMenuModel", ["rpTabsMenuModel", "floorPlanUnitAmenityPropDetUnitsTabsMenuConfigModel", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-tab-menu-config.js
//  Floorplan unit amenities tab menu Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.unitsAmenityAdded = {
            id: "01",
            isActive: true,
            text: "Amenity Added",
            name: "AmenityAdded"
        };

        model.unitsUpgradeEligible = {
            id: "02",
            isActive: false,
            text: "Upgrade Eligible",
            name: "UpgradeEligible"
        };

        model.getData = function () {
            return [
            	model.unitsAmenityAdded, model.unitsUpgradeEligible
            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlanUnitAmenityPropDetUnitsTabsMenuConfigModel", [factory]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-amenity-added.js
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

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-amenity-added-config.js
//  Units Unit Amenities Amenity AddedConfig Model

(function (angular) {
    "use strict";

    function factory(gridConfig, actions) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "unitId"
                },
                {
                    key: "unitNo"
                },
                {
                    key: "buildingNo"
                },
                {
                    key: "floorPlan"
                },
                {
                    key: "floorLevel"
                },
                {
                    key: "dateAdded"
                },
                {
                    key: "pricePoint",
                    type: "custom",                        
                    templateUrl:"home/floorplan-unit/amenity-price-point/templates/price-point-template.html"
                },
                {
                    key: "more",
                    type: "actionsMenu",
                    getActions: actions.get
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "unitId",
                    },
                    {
                        key: "unitNo",
                        text: "Unit",
                        isSortable: true,
                    },
                    {
                        key: "buildingNo",
                        text: "Building",
                        isSortable: true,
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan",
                        isSortable: true,
                    },
                    {
                        key: "floorLevel",
                        text: "Floor",
                        isSortable: true,
                    },
                    {
                        key: "dateAdded",
                        text: "Added",
                        isSortable: true,
                    },
                    {
                        key: "pricePoint",
                        text: "Price Point",
                        isSortable: true,
                    },
                    {
                         key: "more",
                         className: "more"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "unitId",
                },
                {
                    key: "unitNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by unit"
                },
                {
                    key: "buildingNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by building"
                },
                {
                    key: "floorPlan",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor level"
                },
                {
                    key: "dateAdded",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by date added"
                },
                {
                    key: "pricePoint",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by price point"
                },
                {
                    key: "more"
               }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("unitsAmenityAddedConfig", [
            "rpGridConfig",     
            "fpuAmePropDetUnitsAmeAddActionsConfig",       
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-upgrade-eligible.js
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

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-upgrade-eligible-list-manager.js
//  Add units List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function UnitsUpgradeEligibleListManager() {
            var s = this;
            s.init();
        }

        var p = UnitsUpgradeEligibleListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };

        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new UnitsUpgradeEligibleListManager();
    }

    angular
        .module("ui")
        .factory("UnitsUpgradeEligibleListManager", ["$filter", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-amenity-upgrade-eligible.js
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
        .module("ui")
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

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-upgrade-eligible-config.js
//  FloorPlan Unit Amenities Upgrade eligible Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig, actions) {
        var model = gridConfig();

          model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "unitId"
                },
                {
                    key: "unitNo"
                },
                {
                    key: "buildingNo"
                },
                {
                    key: "floorPlan"
                },
                {
                    key: "floorLevel"
                },                
                {
                    key: "delete",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-property-details-units/templates/upgrade-eligible-delete-template.html"                    
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "unitId",
                    },
                    {
                        key: "unitNo",
                        text: "Unit",
                        isSortable: true,
                    },
                    {
                        key: "buildingNo",
                        text: "Building",
                        isSortable: true,
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan",
                        isSortable: true,
                    },
                    {
                        key: "floorLevel",
                        text: "Floor",
                        isSortable: true,
                    },                    
                    {
                         key: "delete",
                         className: "delete"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "unitId",
                },
                {
                    key: "unitNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by unit"
                },
                {
                    key: "buildingNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by building"
                },
                {
                    key: "floorPlan",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor level"
                },                
                {
                    key: "delete"
               }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("unitsUpgradeEligibleConfig", [
            "rpGridConfig",      
            "fpuAmePropDetUnitsUpgEliActionsConfig",      
            factory
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-amenity-upgrade-eligible-config.js
//  FloorPlanUnit Amenity Add Floorplans Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",
                        className: "is-selected",
                        type: "select",
                        enabled: true
                    },
                    {
                        key: "floorplanName",
                        text: "FloorPlans",                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "floorPlanId"
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by FloorPlan name"
                }
            ];
        };



        

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("unitsAmenityUpgradeEligibleConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\add-units-list-manager.js
//  Add Units List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function AddUnitsListManager() {
            var s = this;
            s.init();
        }

        var p = AddUnitsListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };

        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new AddUnitsListManager();
    }

    angular
        .module("ui")
        .factory("AddUnitsListManager", ["$filter", factory]);
})(angular);



//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-upgrade-eligible-action-config.js
//  FloorPlanUnit Amenities Prop Det Units Upg Eli Actions Config

(function (angular) {
    "use strict";

   function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "Change Price Point1",
                        method: model.getMethod("changePricePointUpgEli"),
                        data: record
                    },
                    {
                        text: "Remove1",
                        method: model.getMethod("removeUnitUpgEli"),
                        data: record
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "rp-actions-menu-panel units-actionsmenu"
            });
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmePropDetUnitsUpgEliActionsConfig", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\models\units-amenity-added-action-config.js
//  FloorPlanUnit Amenities Prop Det Units Ami Add Actions Config

(function (angular) {
    "use strict";

    function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "Change Price Point",
                        method: model.getMethod("changePricePointModal"),
                        data: record
                    },
                    {
                        text: "Remove",
                        method: model.getMethod("removeUnit"),
                        data: record
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "rp-actions-menu-panel units-actionsmenu"
            });
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmePropDetUnitsAmeAddActionsConfig", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);




//  Source: ui\home\floorplan-unit\amenity-property-details-units\js\services\units-amenity-added-get.js
//  FloorPlanUnit Amenity Prop detail Units Data Service

(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/amenity-property-detail-units"
        };
        // /api/floorplan-unit/amenity-property-detail-units/:propID/:PMCID

        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("unitsDataSvc", ["$resource","$window", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-property-details-pricepoints\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-property-details-pricepoints\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-property-details-pricepoints/templates/pricepoints-tab.html",
"Price Points Tab");
}]);

//  Source: ui\home\floorplan-unit\amenity-price-point\js\_bundle.inc
//  Source: ui\home\floorplan-unit\amenity-price-point\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/amenity-price-point/templates/price-point-aside.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FpaPropDetPricePointUnitsCtrl as fpaPricePointCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"fpaPricePointCtrl.isPageActive\"><a ng-click=\"fpaPricePointCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Change Price Point</h2><h3 class=\"rp-aside-modal-header-subtitle\">Unit {{::fpaPricePointCtrl.displayUnits}}</h3></div><div ng-if=\"fpaPricePointCtrl.isPageActive\" class=\"rp-aside-modal-content extend floorplan-amenity-price-points-aside\"><div class=\"ft-dark\"><label class=\"form-label\">Amenity Name</label></div><div class=\"space\"><label class=\"form-text\">{{::fpaPricePointCtrl.pricePointsData.amenityName}}</label></div><div class=\"ft-dark\"><label class=\"form-label\">Price Point</label></div><div class=\"space\"><rp-form-select-menu rp-model=\"fpaPricePointCtrl.pricePoint\" config=\"fpaPricePointCtrl.formConfig.pricePoint\"></rp-form-select-menu></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaPricePointCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaPricePointCtrl.save()\" class=\"btn rounded primary pad-left\">Save</button></div></div>");
$templateCache.put("home/floorplan-unit/amenity-price-point/templates/price-point-template.html",
"<div fpu-amenity-prop-details-units-actions><span class=\"\">{{record.pricePoint}}</span><br><a ng-click=\"amenityPropDetailsUnits.showPricePoint(record)\"><span class=\"change\">Change</span></a></div>");
}]);



//  Source: ui\home\floorplan-unit\amenity-price-point\js\controllers\amenity-prop-detail-units-price-point.js
//  Floorplan unit amenities  Property Details Floorplans Assign Unit Controller

(function (angular, undefined) {
    "use strict";

    function FpaPropDetPricePointUnitsCtrl(
        $scope,
        $filter,
        unitsListManager,
        context,
        aside,
        ameContext,
        dataSvcGet,
        menuConfig,
        formConfig,
        pricePointBulk) {
        var vm = this;

        vm.init = function () {
            vm.model = [];
            vm.formConfig = formConfig;
            vm.formConfig.setMethodsSrc(vm);

            vm.loadData();
            vm.isPageActive = true;

            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.loadData = function () {

            if (pricePointBulk.isPricePointBulk) {
                vm.model = context.get().selected;
            }
            else {
                vm.model.push(context.get());
            }

            logc("Unit =>", vm.model);
            vm.getData();
            vm.getUnitsForDisplay();
            // vm.getSelectedAmenity();  
            vm.setDefaultPricePoint();
        };

        vm.setDefaultPricePoint = function () {

            if (pricePointBulk.isPricePointBulk) {
                vm.pricePoint = "";
            }
            else {
                vm.pricePoint = vm.model[0].pricePointID;
            }
        };

        vm.getUnitsForDisplay = function () {

            if (pricePointBulk.isPricePointBulk) {
                vm.displayUnits = pricePointBulk.getSelUnits();
            }
            else {
                vm.displayUnits = vm.model[0].unitNo;
            }
        };

        vm.onSelectedPricePointChange = function (data) {
            vm.updPricePoint = data;
        };

        vm.getSelectedAmenity = function () {
            vm.selAmenity = ameContext.get();
        };

        vm.setOptions = function () {
            formConfig
                .setOptions("pricePoint", vm.pricePointsData.pricePoints);
        };

        vm.save = function () {
            var filter,
                selPricePointObj;

            filter = {
                pricePointID: vm.updPricePoint
            };

            selPricePointObj = $filter("filter")(vm.pricePointsData.pricePoints, filter);

            if (vm.model.length > 0) {
                logc("vm.model", vm.model);

                if (pricePointBulk.isPricePointBulk) {
                    vm.model.forEach(function (unitId) {
                        vm.updateUnitsListWithSelPricePoint(unitId, selPricePointObj[0]);
                    });
                }
                else {
                    logc("vm.model.unitId", vm.model.unitId);
                    vm.updateUnitsListWithSelPricePoint(vm.model[0].unitId, selPricePointObj[0]);
                }

            }

            aside.hide();
        };

        vm.updateUnitsListWithSelPricePoint = function (unitId, pricePoint) {
            var list = unitsListManager.getSelectedList();
            logc("list =>", list);
            list.forEach(function (unit) {
                if (unit.unitId === unitId) {
                    logc("IN", unitId);
                    unit.pricePointID = pricePoint.pricePointID;
                    unit.pricePoint = pricePoint.price;
                }
            });

        };

        vm.closeAside = function () {
            aside.hide();
            vm.isPageActive = false;
            pricePointBulk.isPricePointBulk = false;
        };

        vm.getData = function () {
            var params = {
                amenityID: 1,
                PMCID: 2
            };

            dataSvcGet.getData(params)
                .then(vm.setData, vm.setDataErr);
        };

        vm.setData = function (data) {
            logc("data from price points svc");
            vm.pricePointsData = data;
            vm.setOptions();
        };

        vm.setDataErr = function (data) {
            logc("Error = > ", data);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpaPropDetPricePointUnitsCtrl", [
            "$scope",
            "$filter",
            "AddUnitsListManager",
            "fpuAmenityPropDetailsUnitsPricePointContext",
            "fpuAmenityPropDetailsUnitsPricePointAside",
            "fpuAmenityDetailsContext",
            "fpuAmePropDetUnitsPricePointDataSvc",
            "rpFormSelectMenuConfig",
            "pricePointConfig",
            "fpuPropDetUnitsPricePointBulkModel",
            FpaPropDetPricePointUnitsCtrl
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-price-point\js\models\price-point-aside.js
//  Amenity Property Details Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-price-point/templates/price-point-aside.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitsPricePointAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-price-point\js\models\price-point-context.js
//  Amenity Property Details Units Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitsPricePointContext", ["modalContext", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-price-point\js\models\price-point-config.js
(function (angular) {
    "use strict";

    function factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.pricePoint = menuConfig({
            nameKey: "price",
            valueKey: "pricePointID",
            onChange: model.methods.get("onSelectedPricePointChange")
        });

        model.defaultOptions = {
            pricePoint: {
                price: "Select a price point",
                pricePointID: ""
            }
        };

        model.setOptions = function (fieldName, fieldOptions) {
            var defOption = model.defaultOptions[fieldName];

            fieldOptions = [defOption].concat(fieldOptions);

            if (model[fieldName]) {
                model[fieldName].setOptions(fieldOptions);
            }
            else {
                logc("pricePoint.setOptions: " + fieldName + " is not a valid field name!");
            }
            return model;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("pricePointConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\amenity-price-point\js\models\price-point-bulk.js
//  Floorplan Unit Property Detail Units Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.init = function () {
            model.isPricePointBulk = false;
            return model;
        };

        model.setSelUnits = function (data) {
            model.selUnits = data;
            return model;
        };

        model.getSelUnits = function () {
            return model.selUnits;
        };

        model.reset = function () {
            model = undefined;
        };

        return model.init();
    }

    angular
        .module("ui")
        .factory("fpuPropDetUnitsPricePointBulkModel", [factory]);
})(angular);


//  Source: ui\home\floorplan-unit\amenity-price-point\js\services\amenity-price-points-get.js
//  FloorPlanUnit Amenity Details Grid Data Service


(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/price-points-by-amenity"
        };
        
        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpuAmePropDetUnitsPricePointDataSvc", ["$resource","$window", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\_bundle.inc
//  Source: ui\home\floorplan-unit\floorplan-assign\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/floorplan-assign/templates/floorplan-assign.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FpuAmenityPropDetAssignFloorPlansModalCtrl as fpaPropAssignCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\"><a ng-click=\"fpaPropAssignCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign FloorPlans</h2></div><div ng-if=\"fpaPropAssignCtrl.isPageActive\" class=\"rp-aside-modal-content floorplan-amenity-assign-floorplan-aside\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaPropAssignCtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaPropAssignCtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaPropAssignCtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaPropAssignCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaPropAssignCtrl.assign()\" class=\"btn rounded primary pad-left\">Assign</button></div></div>");
$templateCache.put("home/floorplan-unit/floorplan-assign/templates/upgrade-eligible-assign.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FpuAmenityPropDetAssignUpgradeEligibleModalCtrl as fpaPropAssignUECtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\"><a ng-click=\"fpaPropAssignUECtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign FloorPlans</h2></div><div class=\"rp-aside-modal-content floorplan-amenity-assign-floorplan-aside\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaPropAssignUECtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaPropAssignUECtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaPropAssignUECtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaPropAssignUECtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaPropAssignUECtrl.assign()\" class=\"btn rounded primary pad-left\">Assign</button></div></div>");
}]);




//  Source: ui\home\floorplan-unit\floorplan-assign\js\controllers\amenity-prop-detail-assign-floorplans-modal.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAssignFloorPlansModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        flrPlnAside
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.isPageActive = true;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedListFloorplans");
            flrPlnAside.hide();
        };

        vm.closeAside = function () {
            flrPlnAside.hide();
            vm.isPageActive = false;
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetAssignFloorPlansModalCtrl", [
            "$scope",
            "fpAmenityAddFloorPlansModel",
            "fpAmenityAddFloorPlansConfig",
            "pubsub",
            "AddFloorPlanListManager",
            "fpuAmenityPropDetailsFlrPlnAssignAside",
            FpuAmenityPropDetAssignFloorPlansModalCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\controllers\amenity-prop-detail-assign-upgrade-eligible-modal.js
//  Floorplan unit amenities  Property Details Floorplans Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAssignUpgradeEligibleModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        flrPlnUpgEliAside
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;

            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedListUpgradeEligible");
            flrPlnUpgEliAside.hide();
        };

        vm.closeAside = function () {
            flrPlnUpgEliAside.hide();
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetAssignUpgradeEligibleModalCtrl", [
            "$scope",
            "fpAmenityUpgradeEligibleModel",
            "floorPlansAmenityUpgradeEligibleConfig",
            "pubsub",
            "UpgradeEligibleListManager",
            "fpuAmenityPropDetailsFlrPlnUpgEliAssignAside",
            FpuAmenityPropDetAssignUpgradeEligibleModalCtrl
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\amenity-added-aside.js
// Amenity Property Details Floorplan assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/floorplan-assign/templates/floorplan-assign.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnAssignAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\amenity-added-context.js
//  Amenity Property Details floorplans delete Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnAssignContext", ["modalContext", factory]);
})(angular);


//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\upgrade-eligible-aside.js
// Amenity Property Details Floorplan assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/floorplan-assign/templates/upgrade-eligible-assign.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnUpgEliAssignAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\upgrade-eligible-context.js
//  Amenity Property Details floorplans delete Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnUpgEliAssignContext", ["modalContext", factory]);
})(angular);



//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\upgrade-eligible-assign-floorplans.js
//  floorPlansAmenityAddFloorPlansModel Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridConfig, 
        gridModel, 
        gridTransformSvc,        
        gridPaginationModel,         
        addUpgEligibleManager) {
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
        .module("ui")
        .factory("fpAmenityUpgradeEligibleModel", [
            "floorPlansAmenityUpgradeEligibleConfig",
            "rpGridModel",
            "rpGridTransform",            
            "rpGridPaginationModel",            
            "UpgradeEligibleListManager",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\upgrade-eligible-assign-floorplans-config.js
//  FloorPlanUnit Amenity Add Floorplans Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",
                        className: "is-selected",
                        type: "select",
                        enabled: true
                    },
                    {
                        key: "floorplanName",
                        text: "FloorPlans",                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "floorPlanId"
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by FloorPlan name"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlansAmenityUpgradeEligibleConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\amenity-added-assign-floorplans-config.js
//  FloorPlanUnit Amenity Add Floorplans Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",                        
                        type: "select",
                        enabled: true,    
                        className: "is-selected",                    
                    },
                    {
                        key: "floorplanName",
                        text: "FloorPlans"                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "floorPlanId",                    
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by FloorPlan name"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpAmenityAddFloorPlansConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\floorplan-assign\js\models\amenity-added-assign-floorplans.js
//  floorPlansAmenityAddFloorPlansModel Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridConfig, 
        gridModel, 
        gridTransformSvc,         
        gridPaginationModel,         
        addFloorPlanManager) {
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

        model.getAllData = function () {
            return addFloorPlanManager.getList().records;
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
        .factory("fpAmenityAddFloorPlansModel", [
            "fpAmenityAddFloorPlansConfig",
            "rpGridModel",
            "rpGridTransform",            
            "rpGridPaginationModel",            
            "AddFloorPlanListManager",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\unit-assign\js\_bundle.inc
//  Source: ui\home\floorplan-unit\unit-assign\js\templates\templates.inc.js
angular.module('ui').run(['$templateCache', function ($templateCache) {
$templateCache.put("home/floorplan-unit/unit-assign/templates/assign-unit-upg-eli.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FpuAmenityPropDetUpgEliAssignUnitsModalCtrl as fpaUpgEliUnitsAssignCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"fpaUpgEliUnitsAssignCtrl.isPageActive\"><a ng-click=\"fpaUpgEliUnitsAssignCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign to Units</h2></div><div ng-if=\"fpaUpgEliUnitsAssignCtrl.isPageActive\" class=\"rp-aside-modal-content floorplan-amenity-assign-units-aside\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaUpgEliUnitsAssignCtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaUpgEliUnitsAssignCtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaUpgEliUnitsAssignCtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaUpgEliUnitsAssignCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaUpgEliUnitsAssignCtrl.assign()\" class=\"btn rounded primary pad-left\">Update</button></div></div>");
$templateCache.put("home/floorplan-unit/unit-assign/templates/assign-unit.html",
"<div class=\"rp-aside-modal rp-aside-modal-right rp-aside-modal-show rp-aside-modal-extend-modal-2\" ng-controller=\"FpuAmenityPropDetAmeAddAssignUnitsModalCtrl as fpaAmeAddUnitsAssignCtrl\"><div class=\"rp-aside-modal-header rp-aside-modal-header-wrap extend\" ng-if=\"fpaAmeAddUnitsAssignCtrl.isPageActive\"><a ng-click=\"fpaAmeAddUnitsAssignCtrl.closeAside()\"><i class=\"rp-aside-modal-close font-10\"></i></a><h2 class=\"rp-aside-modal-header-title\">Assign to Units</h2></div><div ng-if=\"fpaAmeAddUnitsAssignCtrl.isPageActive\" class=\"rp-aside-modal-content floorplan-amenity-assign-units-aside\"><div class=\"grid-controls\"><div class=\"grid-control-item\"><rp-toggle model=\"fpaAmeAddUnitsAssignCtrl.grid.filtersModel.state.active\" options=\"{\n" +
"                    defaultText: 'Filter',\n" +
"                    activeIconClass: 'rp-icon-filter',\n" +
"                    defaultIconClass: 'rp-icon-filter active'\n" +
"                }\"></rp-toggle></div></div><div class=\"assign-prop-grid\"><rp-grid model=\"fpaAmeAddUnitsAssignCtrl.grid\"></rp-grid><rp-grid-pagination model=\"fpaAmeAddUnitsAssignCtrl.gridPagination\"></rp-grid-pagination></div></div><div class=\"rp-aside-modal-footer rp-aside-modal-footer-btns aside-btns\"><button ng-click=\"fpaAmeAddUnitsAssignCtrl.closeAside()\" class=\"btn rounded btn-outline b-primary text-primary pad-left\">Cancel</button> <button ng-click=\"fpaAmeAddUnitsAssignCtrl.assign()\" class=\"btn rounded primary pad-left\">Update</button></div></div>");
}]);




//  Source: ui\home\floorplan-unit\unit-assign\js\controllers\amenity-prop-detail-units-assign-unit-modal.js
//  Floorplan unit amenities  Property Details Floorplans Assign Unit Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetAmeAddAssignUnitsModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        addFloorPlanManager,
        asideUnitManager
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.isPageActive = true;
            model.assignUnits();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            addFloorPlanManager.updateSelectedList();
            pubsub.publish("amenityPropDetAmeAddAssignUnits.updateSelectedListUnits");
            asideUnitManager.hide();
        };

        vm.closeAside = function () {
            asideUnitManager.hide();
            vm.isPageActive = false;
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetAmeAddAssignUnitsModalCtrl", [
            "$scope",
            "floorPlansAmenityAddunitsModel",
            "floorPlansAmenityAddUnitsConfig",
            "pubsub",
            "AddUnitsListManager",
            "fpuAmenityPropDetailsUnitAssignAside",
            FpuAmenityPropDetAmeAddAssignUnitsModalCtrl
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\unit-assign\js\controllers\amenity-prop-detail-upg-eli-units-assign-unit-modal.js
//  Floorplan unit amenities  Property Details Floorplans Assign Unit Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetUpgEliAssignUnitsModalCtrl(
        $scope,
        model,
        gridConfig,
        pubsub,
        upgEliManager,
        asideUnitManager
    ) {
        var vm = this;

        vm.init = function () {
            gridConfig.setSrc(vm);

            vm.model = model;
            vm.grid = model.grid;
            vm.gridPagination = model.gridPagination;
            vm.isPageActive = true;
            model.assignUnits();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);

        };

        vm.assign = function () {
            upgEliManager.updateSelectedList();
            pubsub.publish("amenityDetails.updateSelectedListUnitsUpgEli");
            asideUnitManager.hide();
        };

        vm.closeAside = function () {
            asideUnitManager.hide();
            vm.isPageActive = false;
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetUpgEliAssignUnitsModalCtrl", [
            "$scope",
            "floorPlansUpgEliunitsModel",
            "floorPlansUpgEliUnitsConfig",
            "pubsub",
            "UnitsUpgradeEligibleListManager",
            "fpuAmenityPropDetailsUnitUpgEliAssignAside",
            FpuAmenityPropDetUpgEliAssignUnitsModalCtrl
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\unit-assign\js\models\amenity-add-units.js
//  floorPlansAmenityAdd Units  Model

(function (angular, undefined) {
    "use strict";

    function factory(
        gridConfig,
        gridModel,
        gridTransformSvc,
        gridPaginationModel,
        addFloorPlanManager
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

            return model;
        };

        model.assignUnits = function () {
            model.setGridPagination();
        };

        model.getAllData = function () {
            return addFloorPlanManager.getList().records;
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
        .factory("floorPlansAmenityAddunitsModel", [
            "floorPlansAmenityAddUnitsConfig",
            "rpGridModel",
            "rpGridTransform",
            "rpGridPaginationModel",
            "AddUnitsListManager",
            factory
        ]);
})(angular);

//  Source: ui\home\floorplan-unit\unit-assign\js\models\amenity-add-units-config.js
//  FloorPlanUnit Amenity Add Floorplans Assign units Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "unitId"
                },
                {
                    key: "unitNo"
                },
                {
                    key: "buildingNo"
                },
                {
                    key: "floorPlan"
                },
                {
                    key: "floorLevel"
                }                
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",                        
                        type: "select",
                        enabled: true,    
                        className: "is-selected",                    
                    },
                    {
                        key: "unitNo",
                        text: "Unit",                        
                    },
                    {
                        key: "buildingNo",
                        text: "Building"                        
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan"                        
                    },
                    {
                        key: "floorLevel",
                        text: "Floor"                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "unitId",                    
                },
                {
                    key: "unitNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by unit"
                },
                {
                    key: "buildingNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by building"
                },
                {
                    key: "floorPlan",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor plan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlansAmenityAddUnitsConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);



//  Source: ui\home\floorplan-unit\unit-assign\js\models\amenity-add-units-upg-eli.js
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

//  Source: ui\home\floorplan-unit\unit-assign\js\models\amenity-add-units-config-upg-eli.js
//  FloorPlanUnit Amenity Add Floorplans Assign units Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "unitId"
                },
                {
                    key: "unitNo"
                },
                {
                    key: "buildingNo"
                },
                {
                    key: "floorPlan"
                },
                {
                    key: "floorLevel"
                }                
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",                        
                        type: "select",
                        enabled: true,    
                        className: "is-selected",                    
                    },
                    {
                        key: "unitNo",
                        text: "Unit",                        
                    },
                    {
                        key: "buildingNo",
                        text: "Building"                        
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan"                        
                    },
                    {
                        key: "floorLevel",
                        text: "Floor"                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "unitId",                    
                },
                {
                    key: "unitNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by unit"
                },
                {
                    key: "buildingNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by building"
                },
                {
                    key: "floorPlan",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor plan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlansUpgEliUnitsConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);


//  Source: ui\home\floorplan-unit\unit-assign\js\models\amenity-added-aside.js
// Amenity Property Details Units assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/unit-assign/templates/assign-unit.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitAssignAside", ["rightAsideModal", factory]);
})(angular);

//  Source: ui\home\floorplan-unit\unit-assign\js\models\upgrade-eligible.aside.js
// Amenity Property Details Unit assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/unit-assign/templates/assign-unit-upg-eli.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitUpgEliAssignAside", ["rightAsideModal", factory]);
})(angular);


