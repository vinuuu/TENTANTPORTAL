//  FloorPlanUnit Amenity Floorplans Actions Config
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
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "menu-index"
            });
        };

        return model;
    }

    angular
        .module("ui")
        .factory("floorPlansAmenityAddedActionsConfig", ["rpGridActions", "rpActionsMenuModel", factory]);
})(angular);
