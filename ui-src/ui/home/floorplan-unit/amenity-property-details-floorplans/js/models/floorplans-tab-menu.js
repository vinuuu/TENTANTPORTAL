//  Floorplan Unit Property Detail Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsMenuModel, tabsMenuDataModel) {
        var model = {};

        model.init = function () {
            model.tabsMenu = tabsMenuModel();
            model.tabsDataModel = tabsMenuDataModel;
            model.tabsData = tabsMenuDataModel.getData();
            model.tabsMenu.setOptions(model.tabsData);

            return model;
        };

        model.getData = function () {
            return model.tabsData;
        };

        model.subscribe = function (fn) {
            model.tabsMenu.subscribe("change", fn);
        };

        model.reset = function () {
            model.tabsMenu.destroy();
            model.tabsData = undefined;
            model.tabsMenu = undefined;
        };

        return model.init();
    }

    angular
        .module("uam")
        .factory("fpuAmenityPropDetTabsMenuModel", ["rpTabsMenuModel", "floorPlanUnitAmenityPropDetTabsMenuConfigModel", factory]);
})(angular);
