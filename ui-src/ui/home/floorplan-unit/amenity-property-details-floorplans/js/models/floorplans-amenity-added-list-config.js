//  FloorPlan Unit Amenities Amenity AddedConfig Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "floorPlanId"
                },
                {
                    key: "floorplanName"
                },
                {
                    key: "dateAdded"
                },
                {
                    key: "delete",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-property-details-floorplans/templates/amenity-added-delete-template.html"                                     
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "floorPlanId",
                    },
                    {
                        key: "floorplanName",
                        text: "Floor Plan",
                        isSortable: true,
                    },
                    {
                        key: "dateAdded",
                        text: "Added",
                        isSortable: true,
                    },
                    {
                         key: "delete",
                         className: "delete"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "floorPlanId",
                },
                {
                    key: "floorplanName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan name"
                },
                {
                    key: "dateAdded",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by date added"
                },
                {
                    key: "delete"
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
        .factory("fpAmenityAddedConfig", [
            "rpGridConfig",            
            factory
        ]);
})(angular);
