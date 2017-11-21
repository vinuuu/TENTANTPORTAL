//  Source: uam\home\_base\js\controllers\home.js
//  Home Controller

(function (angular, undefined) {
    "use strict";

    function HomeCtrl($scope, tabsModel) {
        var vm = this;

        vm.init = function () {
            vm.tabsModel = tabsModel.get();
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.changeWatch = tabsModel.subscribe(tabsModel.change);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm.changeWatch();
            tabsModel.reset();
            tabsModel = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("uam")
        .controller("HomeCtrl", ["$scope", "amenitiesScrollingTabsModel", HomeCtrl]);
})(angular);


//  Source: uam\home\_base\js\models\tabs-config.js
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
