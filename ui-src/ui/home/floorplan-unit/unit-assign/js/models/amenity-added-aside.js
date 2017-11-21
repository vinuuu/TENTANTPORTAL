 // Amenity Property Details Units assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/unit-assign/templates/assign-unit.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitAssignAside", ["rightAsideModal", factory]);
})(angular);
