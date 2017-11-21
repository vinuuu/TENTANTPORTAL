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
