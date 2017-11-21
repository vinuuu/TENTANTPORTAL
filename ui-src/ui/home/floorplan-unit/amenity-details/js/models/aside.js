//  Amenity Details Aside Model

(function (angular, undefined) {
    "use strict";

    function factory(rightAsideModal) {
        return rightAsideModal("home/floorplan-unit/amenity-details/templates/index.html");
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsAside", ["rightAsideModal", factory]);
})(angular);
