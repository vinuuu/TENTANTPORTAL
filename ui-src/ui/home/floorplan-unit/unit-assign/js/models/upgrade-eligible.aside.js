 // Amenity Property Details Unit assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/unit-assign/templates/assign-unit-upg-eli.html");
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetailsUnitUpgEliAssignAside", ["rightAsideModal", factory]);
})(angular);
