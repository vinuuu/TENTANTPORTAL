//   Actions Menu amenity property  Model

(function (angular) {
    "use strict";

    function factory(actionsMenu) {
        var model = {
            src: {}
        };

        model.init = function (src) {
            model.src = src;
            return model;
        };

        model.getMenu = function () {
            return actionsMenu({
                actions: [
                    {
                        text: "Edit",
                        method: model.src.edit
                    },
                    {                        
                        text: "Mark as Undisplayed",
                        method: model.src.markUndisplayed
                    },
                    {                        
                        text: "Assign to Floor Plan / Unit",
                        method: model.src.assignToFloorPlanUnit
                    },
                    {                        
                        text: "Remove from Property",
                        method: model.src.removeFromProperty
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "rp-actions-menu-panel floorplan-actionsmenu"
            });
        };
        

        return model;
    }

    angular
        .module("uam")
        .factory("amenityPropertyActionsMenuModel", ["rpActionsMenuModel", factory]);
})(angular);


