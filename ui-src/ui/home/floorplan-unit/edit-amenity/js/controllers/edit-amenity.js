//  Edit Amenity Controller

(function (angular, undefined) {
    "use strict";

    function FpuEditAmenityCtrl($scope, aside, context) {
        var vm = this;

        vm.init = function () {
            vm.amenity = context.get();
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
        .module("ui")
        .controller("FpuEditAmenityCtrl", [
            "$scope",
            "fpuEditAmenityAside",
            "fpuEditAmenityContext",
            FpuEditAmenityCtrl
        ]);
})(angular);
