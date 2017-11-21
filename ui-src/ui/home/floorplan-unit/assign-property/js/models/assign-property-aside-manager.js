//  Amenities Assign Prop aside Manager Model

(function (angular, undefined) {
    "use strict";

    function factory(asideModal) {
        function AmenityAssignPropAsideManager() {
            var s = this;
            s.isLoadedFlag = false;
            s.init();
        }

        var p = AmenityAssignPropAsideManager.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            s.asideDetail = asideModal;
            
            if (!s.isLoadedFlag) {
                s.isLoadedFlag = true;
                s.asideDetail.loadAside();
            }

        };

        // Getters

        p.showAsideModal = function () {
            var s = this;
            s.asideDetail.showAsideModal();
            return s;
        };

        p.hideModal = function () {
            var s = this;
            s.asideDetail.hideModal();
            return s;
        };

        // Setters

        p.setAmenData = function (data) {
            var s = this;
            s.data = data;
            return s;
        };

        p.getAmenData = function () {
            var s = this;
            return s.data;
        };

        p.reset = function () {
            var s = this;
            s.data = {};
        };

        return new AmenityAssignPropAsideManager();
    }

    angular
        .module("ui")
        .factory("AmenityAssignPropAsideManager", ["AmenityAssignPropAsideModel", factory]);
})(angular);
