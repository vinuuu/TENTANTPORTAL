 // Amenity Property Details Floorplan Delete Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-price-point/templates/price-point-aside.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnAssignAside", ["rightAsideModal", factory]);
})(angular);
