 // Amenity Property Details Floorplan assign Aside

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/floorplan-assign/templates/upgrade-eligible-assign.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnUpgEliAssignAside", ["rightAsideModal", factory]);
})(angular);
