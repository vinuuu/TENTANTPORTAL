//  Amenities List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($aside) {
        function AmenityAssignPropAsideModel() {
            var s = this;
            s.init();
        }

        var p = AmenityAssignPropAsideModel.prototype;

        p.init = function () {
            var s = this;
            s.asideDetail = {};
        };

        
        p.loadAside = function () {
            logc("prop assign aside  loaded");
            var s = this;
            
            s.asideAssignPropModal = $aside({
                backdrop: true,
                show: false,
                animation: "am-fade-and-slide-right",
                placement: "right",
                templateUrl: "home/floorplan-unit/assign-property/templates/assign-property-aside.html"
            });

            return s;
        };

        
        p.showAsideModal = function () {
            var s = this;
            s.asideAssignPropModal.$promise.then(function () {
                s.asideAssignPropModal.show();
            });
            return s;
        };

        p.hideModal = function () {
            var s = this;
            s.asideAssignPropModal.$promise.then(function () {
                s.asideAssignPropModal.hide();
            });
            return s;
        };

        p.reset = function () {
            var s = this;
            s.isLoadedFlag = false;
        };

        return new AmenityAssignPropAsideModel();
    }

    angular
        .module("uam")
        .factory("AmenityAssignPropAsideModel", ["$aside", factory]);
})(angular);
