//  Amenity Property Details Units Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsUnitsPricePointContext", ["modalContext", factory]);
})(angular);
