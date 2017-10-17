//  FloorPlanUnit Amenities Actions Config

(function (angular) {
    "use strict";

    function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "View",
                        method: model.getMethod("view"),
                        data: record
                    },
                    {
                        text: "Edit",
                        method: model.getMethod("edit"),
                        data: record
                    },
                    {
                        text: "Assign Properties",
                        method: model.getMethod("assignSelAmenitiesToProperties"),
                        data: record
                    },
                    {
                        text: "Delete",
                        method: model.getMethod("deleteAmenity"),
                        data: record
                    }
                ],
                menuOffsetLeft: -230
            });
        };

        return model;
    }

    angular
        .module("uam")
        .factory("fpuAmenitiesListActions", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);
