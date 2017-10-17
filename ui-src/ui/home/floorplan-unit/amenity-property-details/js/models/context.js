//  Amenity Property Details Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetailsContext", ["modalContext", factory]);
})(angular);
