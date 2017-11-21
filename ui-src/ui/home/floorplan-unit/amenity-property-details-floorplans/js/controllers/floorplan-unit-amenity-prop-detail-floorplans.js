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
