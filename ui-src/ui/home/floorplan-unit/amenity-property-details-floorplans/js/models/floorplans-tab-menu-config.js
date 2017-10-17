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
        .module("uam")
        .factory("floorPlanUnitAmenityPropDetTabsMenuConfigModel", [factory]);
})(angular);
