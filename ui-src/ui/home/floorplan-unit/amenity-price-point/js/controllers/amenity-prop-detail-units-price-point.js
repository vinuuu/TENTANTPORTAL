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
        .module("uam")
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
