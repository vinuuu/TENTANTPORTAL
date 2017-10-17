//  Workspaces Config Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsMenuModel) {
        var model = {};

        model.init = function () {
            model.tabsMenu = tabsMenuModel();
            return model;
        };

        model.subscribe = function (fn) {
            model.tabsMenu.subscribe("change", fn);
        };

        model.change = function (tab) {
            logc(tab);
        };

        model.setData = function () {
            var data = [
                {
                    id: "01",
                    className: "",
                    isActive: false,
                    text: "Common Area",
                    sref: "home.common-area",
                },
                {
                    id: "02",
                    className: "",
                    isActive: true,
                    text: "Floor Plan / Unit",
                    sref: "home.floorplan-unit",

                },
                {
                    id: "03",
                    className: "",
                    isActive: false,
                    text: "Activity",
                    sref: "home.activity"
                }
            ];

            model.tabsMenu.setData(data);

            return model;
        };

        model.get = function () {
            return model.init().setData().tabsMenu;
        };

        model.reset = function () {
            model.tabsMenu.destroy();
            model.tabsMenu = undefined;
        };

        return model;
    }

    angular
        .module("uam")
        .factory("amenitiesScrollingTabsModel", ["rpScrollingTabsMenuModel", factory]);
})(angular);
