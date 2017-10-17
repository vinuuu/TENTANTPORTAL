//  Floorplan Unit Property Detail Units Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var model = {};

        model.init = function () {
            model.isPricePointBulk = false;
            return model;
        };

        model.setSelUnits = function (data) {
            model.selUnits = data;
            return model;
        };

        model.getSelUnits = function () {
            return model.selUnits;
        };

        model.reset = function () {
            model = undefined;
        };

        return model.init();
    }

    angular
        .module("uam")
        .factory("fpuPropDetUnitsPricePointBulkModel", [factory]);
})(angular);
