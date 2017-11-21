//  Floorplan unit amenities  delete amenities Controller

(function (angular, undefined) {
    "use strict";

    function FpuAmenityPropDetDeleteConfirmModalCtrl($scope, model, dataSvcDel) {
        var vm = this;

        vm.init = function () {                     
            vm.model = model;  
            vm.destWatch = $scope.$on("$destroy", vm.destroy);            
        };

        vm.hideModal = function () {
            model.hideDeleteConfirmModal();
        };

        vm.hideDeleteAmenityModal = function () {
            model.hideDeleteAmenityConfirmModal();
        };       
        

        vm.confirmDeleteSelectedAmenities = function () {
            logc("Confirmed Delete");
            vm.hideModal();            
            model.deleteSelectedAmenities(dataSvcDel);
        };

        vm.confirmDeleteAmenity = function () {
            logc("Confirmed Delete");
            vm.hideDeleteAmenityModal();            
            model.deleteAmenity(dataSvcDel);
        };


        vm.selectedFloorPlansForDisplay = function () {
            
        };

        vm.destroy = function () {
            vm.destWatch();
            // vm.changeWatch();
            // model.reset();
            // model = undefined;
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("FpuAmenityPropDetDeleteConfirmModalCtrl", [
            "$scope",
            "amenitiesModel",
            "amenitiesDeleteSvc",
            FpuAmenityPropDetDeleteConfirmModalCtrl
        ]);
})(angular);
