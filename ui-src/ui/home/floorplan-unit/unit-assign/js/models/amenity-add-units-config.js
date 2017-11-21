

//  FloorPlanUnit Amenity Add Floorplans Assign units Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
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
                }                
            ];
        };

        model.getHeaders = function () {
            return [
                [
                    {
                        Key: "isSelected",                        
                        type: "select",
                        enabled: true,    
                        className: "is-selected",                    
                    },
                    {
                        key: "unitNo",
                        text: "Unit",                        
                    },
                    {
                        key: "buildingNo",
                        text: "Building"                        
                    },
                    {
                        key: "floorPlan",
                        text: "Floor Plan"                        
                    },
                    {
                        key: "floorLevel",
                        text: "Floor"                        
                    }
                ]
            ];
        };

        model.getFilters = function () {
            return [
                {
                    Key: "unitId",                    
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
                    placeholder: "Search by floor plan"
                },
                {
                    key: "floorLevel",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by floor"
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
        .factory("floorPlansAmenityAddUnitsConfig", [
            "rpGridConfig",
            factory
        ]);
})(angular);
