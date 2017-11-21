//  Edit Amenity Context Service

(function (angular) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("ui")
        .factory("fpuEditAmenityContext", ["modalContext", factory]);
})(angular);
