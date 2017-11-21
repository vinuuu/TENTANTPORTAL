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
