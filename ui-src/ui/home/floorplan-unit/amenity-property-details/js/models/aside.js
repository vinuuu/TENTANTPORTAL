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
