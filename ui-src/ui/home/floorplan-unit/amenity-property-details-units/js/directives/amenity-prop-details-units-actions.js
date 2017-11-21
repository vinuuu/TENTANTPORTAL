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



