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
