//  Units Unit Amenities Amenity AddedConfig Model

(function (angular) {
    "use strict";

    function factory(gridConfig, actions) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isDelSelected",
                    type: "select",
                    idKey: "unitId"
                },
                {
                    key: "unitNo"
                },
                {
                    key: "buildingNo"
                },
                {
                    key: "floorPlan"
                },
                {
                    key: "floorLevel"
                },
                {
                    key: "dateAdded"
                },
                {
                    key: "pricePoint",
                    type: "custom",                        
                    templateUrl:"home/floorplan-unit/amenity-price-point/templates/price-point-template.html"
                },
                {
                    key: "more",
                    type: "actionsMenu",
                    getActions: actions.get
                },
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        key: "unitId",
                    },
                    {
                        key: "unitNo",
                        text: "Unit",
                        isSortable: true,
                    },
                    {
                        key: "buildingNo",
                        text: "Building",
                        isSortable: true,
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan",
                        isSortable: true,
                    },
                    {
                        key: "floorLevel",
                        text: "Floor",
                        isSortable: true,
                    },
                    {
                        key: "dateAdded",
                        text: "Added",
                        isSortable: true,
                    },
                    {
                        key: "pricePoint",
                        text: "Price Point",
                        isSortable: true,
                    },
                    {
                         key: "more",
                         className: "more"
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    key: "unitId",
                },
                {
                    key: "unitNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by unit"
                },
                {
                    key: "buildingNo",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by building"
                },
                {
                    key: "floorPlan",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floorplan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor level"
                },
                {
                    key: "dateAdded",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by date added"
                },
                {
                    key: "pricePoint",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by price point"
                },
                {
                    key: "more"
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
        .factory("unitsAmenityAddedConfig", [
            "rpGridConfig",     
            "fpuAmePropDetUnitsAmeAddActionsConfig",       
            factory
        ]);
})(angular);
