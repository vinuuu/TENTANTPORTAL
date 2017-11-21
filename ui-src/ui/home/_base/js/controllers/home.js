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
        .module("ui")
        .controller("HomeCtrl", ["$scope", "amenitiesScrollingTabsModel", HomeCtrl]);
})(angular);
