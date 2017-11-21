//  Amenity Details Context

(function (angular, undefined) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuAmenityDetailsContext", ["modalContext", factory]);
})(angular);
