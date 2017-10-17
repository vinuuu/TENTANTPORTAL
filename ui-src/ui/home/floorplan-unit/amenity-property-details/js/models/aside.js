//  Amenity Property Details Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-property-details/templates/index.html");
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetailsAside", ["rightAsideModal", factory]);
})(angular);
