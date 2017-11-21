//  FloorPlanUnit Amenities Config Model

(function (angular) {
    "use strict";

    function factory(gridConfig, actions) {
        var model = gridConfig();

        model.get = function () {
            return [
                {
                    key: "isSelected",
                    type: "select",
                    idKey: "amenityID"
                },
                {
                    key: "amenityName",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-name.html"
                },
                {
                    key: "totalProperties",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-prop.html"
                },
                {
                    key: "priceRange",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/amenity-price.html"
                },
                {
                    key: "edit",
                    type: "custom",
                    templateUrl: "home/floorplan-unit/amenities/templates/edit-amenity.html",
                    className: "rp-actions-menu-item-1"
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
                        key: "amenityID",
                        className: "amenity-id"
                    },
                    {
                        key: "amenityName",
                        text: "Name",
                        isSortable: true,
                        className: "amenity-name"
                    },
                    {
                        key: "totalProperties",
                        text: "Properties",
                        isSortable: true,
                        className: "total-properties"
                    },
                    {
                        key: "priceRange",
                        text: "Price",
                        isSortable: true,
                        className: "price-price"
                    },
                    {
                        key: "edit",
                        className: "edit"
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
                    key: "amenityID",
                },
                {
                    key: "amenityName",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Search by amenity name"
                },
                {
                    key: "totalProperties"
                },
                {
                    key: "priceRange",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "No min - No max"
                },
                {
                    key: "edit"
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
        .module("ui")
        .factory("fpuAmenitiesListConfig", [
            "rpGridConfig",
            "fpuAmenitiesListActions",
            factory
        ]);
})(angular);
