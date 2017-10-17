 // Amenity Property Details Floorplan assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/floorplan-assign/templates/floorplan-assign.html");
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetailsFlrPlnAssignAside", ["rightAsideModal", factory]);
})(angular);
