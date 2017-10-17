//  Floorplan unit amenities tab menu Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.amenities = {
            id: "01",
            isActive: true,
            text: "Amenities",
            name: "Amenities"
        };

        model.properties = {
            id: "02",
            isActive: false,
            text: "Properties",
            name: "Properties"
        };

        model.getTabsList = function () {
            return [
            	model.amenities,
                model.properties
            ];
        };

        return model;
    }

    angular
        .module("uam")
        .factory("amenitiesTabsData", [factory]);
})(angular);
