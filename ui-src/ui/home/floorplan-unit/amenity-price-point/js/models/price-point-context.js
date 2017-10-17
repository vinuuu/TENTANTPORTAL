//  Amenity Property Details Units Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetailsUnitsPricePointContext", ["modalContext", factory]);
})(angular);
