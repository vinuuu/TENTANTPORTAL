//  Home Controller

(function(angular, undefined) {
    "use strict";

    function HomeCtrl($scope, tabsModel) {
        var vm = this;

        vm.init = function() {

        };

        vm.destroy = function() {
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("HomeCtrl", ["$scope", "baseModel", HomeCtrl]);
})(angular);