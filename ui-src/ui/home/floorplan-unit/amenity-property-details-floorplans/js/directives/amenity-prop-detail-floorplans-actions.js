//  Amenity Prop Detail floorplans Actions Directive

(function (angular) {
    "use strict";

    function fpuAmenityPropDetailsFlrPlnActions(model,upgEliModel) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.amenityPropDetailsFlrPlns = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.deleteAmeAddFlrPlan = function (data) {
                logc("New Delete",data);
                model.amAddFloorPlanDelete(data);                
            };

            dir.deleteUpgEliFlrPlan = function (data) {
                logc("New Delete",data);
                upgEliModel.upgradeEligibleFloorPlanDelete(data);                
            };
                       
            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("uam")
        .directive("fpuAmenityPropDetailsFlrPlnActions", [
            "fpAmenityAddedModel",
            "fpUpgradeEligibleListModel",            
            fpuAmenityPropDetailsFlrPlnActions
        ]);
})(angular);



