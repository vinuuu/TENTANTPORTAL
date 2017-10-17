//  Amenity Property DetailsTabs  Config

(function (angular) {
    "use strict";

    function factory() {
        var model = {};

        model.data = [
            {
                id: "01",
                isActive: true,
                text: "Floor Plans",
                url: "floorplans"
            },
            {
                id: "02",
                isActive: false,
                text: "Units",
                url: "units"
            },
            {
                id: "03",
                isActive: false,
                text: "Price Points",
                url: "pricepoints"
            }
        ];

        model.getData = function () {
            return model.data;
        };

        model.getActiveTab = function () {
            var url;

            model.data.forEach(function (tab) {
                if (tab.isActive) {
                    url = tab.url;
                }
            });

            return "home/floorplan-unit/amenity-property-details-" + url + "/templates/" + url + "-tab.html";
        };

        return model;
    }

    angular
        .module("uam")
        .factory("fpuAmenityDetailsTabsConfig", [factory]);
})(angular);
