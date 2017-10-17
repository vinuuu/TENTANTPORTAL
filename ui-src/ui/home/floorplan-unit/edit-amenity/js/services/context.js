//  Edit Amenity Context Service

(function (angular) {
    "use strict";

    function factory(modalContext) {
        return modalContext();
    }

    angular
        .module("uam")
        .factory("fpuEditAmenityContext", ["modalContext", factory]);
})(angular);
