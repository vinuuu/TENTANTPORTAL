//  Amenity Property

(function (angular, undefined) {
    "use strict";

    function fpuAmenityActions(editAside, editContext, detailsAside, detailsContext) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityActions = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.showAmenity = function (amenity) {
                detailsContext.set(amenity);
                detailsAside.show();
            };

            dir.editAmenity = function (amenity) {
                editContext.set(amenity);
                editAside.show();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("uam")
        .directive("fpuAmenityActions", [
            "fpuEditAmenityAside",
            "fpuEditAmenityContext",
            "fpuAmenityDetailsAside",
            "fpuAmenityDetailsContext",
            fpuAmenityActions
        ]);
})(angular);
