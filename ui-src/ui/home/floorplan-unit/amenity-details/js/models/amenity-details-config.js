//  FloorPlanUnit Amenity Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "siteName",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/name.html"
                },
                {
                    key: "floorPlans",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/floorplans.html"
                },
                {
                    key: "units",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-details/templates/units.html"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [

                    {
                        key: "siteName",
                        text: "Name",
                        isSortable: true,
                        className: "site-name"
                    },
                    {
                        key: "floorPlans",
                        text: "Floor Plans",
                        isSortable: true,
                        className: "floor-plans"
                    },
                    {
                        key: "units",
                        text: "Units",
                        isSortable: true,
                        className: "units"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "siteName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Property Name"
                },
                {
                    key: "floorPlans",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Floor Plan Count"
                },
                {
                    key: "units",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Units Count"
                }
            ];
        };

        model.getTrackSelectionConfig = function () {
            var config = {},
                columns = model.get();

            columns.forEach(function (column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };

        return model;
    }

    angular
        .module("uam")
        .factory("fpuAmenityDetailsConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);
