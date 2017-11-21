//  FloorPlanUnit Amenity Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "siteID"
                },
                {
                    key: "siteName"
                }
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",
                        className: "is-selected",
                        type: "select",
                        enabled: true
                    },
                    {
                        key: "siteName",
                        text: "Property",
                        className: "site-name"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "siteID"
                },
                {
                    key: "siteName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by Property Name"
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
        .module("ui")
        .factory("floorPlanUnitAmenityAssignPropConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);
