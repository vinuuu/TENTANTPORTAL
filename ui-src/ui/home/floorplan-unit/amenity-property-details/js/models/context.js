//  Amenity Property Details Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityPropDetailsContext", ["modalContext", factory]);
})(angular);
