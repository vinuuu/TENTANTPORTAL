//  Amenity Detail Actions Directive

(function (angular) {
    "use strict";

    function fpuAmenityDetailActions(aside, context) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityDetailActions = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.showPropDetails = function (data) {
                context.set(data);
                aside.show();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
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
        .directive("fpuAmenityDetailActions", [
            "fpuAmenityPropDetailsAside",
            "fpuAmenityPropDetailsContext",
            fpuAmenityDetailActions
        ]);
})(angular);
