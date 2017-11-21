//  FloorPlanUnit Amenities Prop Det Units Ami Add Actions Config

(function (angular) {
    "use strict";

    function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "Change Price Point",
                        method: model.getMethod("changePricePointModal"),
                        data: record
                    },
                    {
                        text: "Remove",
                        method: model.getMethod("removeUnit"),
                        data: record
                    }
                ],
                menuOffsetLeft: -230,
                menuClassNames: "rp-actions-menu-panel units-actionsmenu"
            });
        };

        return model;
    }

    angular
        .module("ui")
        .factory("fpuAmePropDetUnitsAmeAddActionsConfig", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);
