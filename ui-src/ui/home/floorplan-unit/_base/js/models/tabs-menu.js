//  Workspaces Config Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsModel, tabsData) {
        var model = {};

        model.init = function () {
            model.tabsData = tabsData.getTabsList();
            model.tabsMenu = tabsModel().setOptions(model.tabsData);
            return model;
        };

        model.getData = function () {
            return model.tabsData;
        };

        model.getMenu = function () {
            return model.tabsMenu;
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
        .module("ui")
        .factory("amenitiesTabsMenu", ["rpTabsMenuModel", "amenitiesTabsData", factory]);
})(angular);
