//  App Controller

(function (angular) {
    "use strict";

    function AppCtrl() {
        var vm = this;

        vm.init = function () {

        };

        vm.destroy = function () {

        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("AppCtrl", [AppCtrl]);
})(angular);
