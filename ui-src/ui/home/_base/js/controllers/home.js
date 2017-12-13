//  Home Controller

(function(angular, undefined) {
    "use strict";

    function HomeCtrl($scope, tabsModel, rpBdgtBreadcrumbsModel, $location) {
        var vm = this;

        vm.init = function() {
            rpBdgtBreadcrumbsModel.setLinks("event", $location.absUrl(), $location.absUrl());
        };

        vm.destroy = function() {
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("HomeCtrl", ["$scope", "baseModel", 'rpBdgtBreadcrumbsModel', '$location', HomeCtrl]);
})(angular);