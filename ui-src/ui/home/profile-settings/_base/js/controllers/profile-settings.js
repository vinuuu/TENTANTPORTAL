//  Profile Settings Controller

(function (angular, undefined) {
    "use strict";

    function ProfileSettingsCtrl($scope,formConfig) {
        var vm = this;
        vm.formConfig = {};

        vm.init = function () {
            vm.message = "Welcome to Floor Plan Units";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.formConfig = formConfig;
            formConfig.setMethodsSrc(vm);
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
        .controller("ProfileSettingsCtrl", [
            "$scope",
            "profile-settings-config",
            ProfileSettingsCtrl
        ]);
})(angular);
