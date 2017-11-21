//  FloorPlanUnit Amenities Prop Det Units Upg Eli Actions Config

(function (angular) {
    "use strict";

   function factory(gridActions, actionsMenu) {
        var model = gridActions();

        model.get = function (record) {
            return actionsMenu({
                actions: [
                    {
                        text: "Change Price Point1",
                        method: model.getMethod("changePricePointUpgEli"),
                        data: record
                    },
                    {
                        text: "Remove1",
                        method: model.getMethod("removeUnitUpgEli"),
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
        .factory("fpuAmePropDetUnitsUpgEliActionsConfig", [
            "rpGridActions",
            "rpActionsMenuModel",
            factory
        ]);
})(angular);
