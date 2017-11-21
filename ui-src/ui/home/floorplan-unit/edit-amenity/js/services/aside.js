//  Edit Amenity Aside Service

(function (angular) {
    "use strict";

    function FpuEditAmenityAside(rightAsideModal) {
        var svc = this;

        svc.aside = rightAsideModal("home/floorplan-unit/edit-amenity/templates/index.html");

        svc.show = function () {
            svc.aside.show();
        };

        svc.hide = function () {
            svc.aside.hide();
        };
    }

    angular
        .module("ui")
        .service("fpuEditAmenityAside", [
            "rightAsideModal",
            FpuEditAmenityAside
        ]);
})(angular);
