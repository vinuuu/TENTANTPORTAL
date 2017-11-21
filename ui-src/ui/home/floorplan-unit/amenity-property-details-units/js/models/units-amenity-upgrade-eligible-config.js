

//  FloorPlanUnit Amenity Add Floorplans Details Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
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
                        key: "floorplanName",
                        text: "FloorPlans",                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "floorPlanId"
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by FloorPlan name"
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
        .factory("unitsAmenityUpgradeEligibleConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);
