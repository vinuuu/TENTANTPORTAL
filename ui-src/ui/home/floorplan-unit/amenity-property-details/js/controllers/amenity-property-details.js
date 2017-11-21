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
