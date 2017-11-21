//  Source: uam\home\profile-settings\js\controllers\profile-settings.js
//  Home Controller

(function (angular, undefined) {
    "use strict";

    function ProfileSettingsCtrl($scope) {
        var vm = this;

        vm.init = function () {
            vm.message = "Settings";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("uam")
        .controller("ProfileSettingsCtrl", ["$scope", ProfileSettingsCtrl]);
})(angular);


