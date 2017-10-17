//  FloorPlanUnit Amenity Details Grid Data Service

(function (angular) {
    "use strict";

    function factory($resource) {
        return $resource("/api/floorplan-unit/properties-by-amenity", {}, {
            get: {
                method: "GET",
                cancellable: true
            }
        });
    }

    angular
        .module("uam")
        .factory("floorPlanUnitAmenityAssignPropDataSvc", ["$resource", factory]);
})(angular);
