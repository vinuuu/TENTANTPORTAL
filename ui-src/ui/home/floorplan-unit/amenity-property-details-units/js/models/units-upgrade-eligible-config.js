//  FloorPlan Unit Amenities Upgrade eligible Config Model

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
                    key: "delete",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenity-property-details-units/templates/upgrade-eligible-delete-template.html"                    
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
                         key: "delete",
                         className: "delete"
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
        .module("ui")
        .factory("unitsUpgradeEligibleConfig", [
            "rpGridConfig",      
            "fpuAmePropDetUnitsUpgEliActionsConfig",      
            factory
        ]);
})(angular);
