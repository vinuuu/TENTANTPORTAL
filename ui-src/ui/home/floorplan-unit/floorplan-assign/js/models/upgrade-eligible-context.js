//  Amenity Property Details floorplans delete Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsFlrPlnUpgEliAssignContext", ["modalContext", factory]);
})(angular);
