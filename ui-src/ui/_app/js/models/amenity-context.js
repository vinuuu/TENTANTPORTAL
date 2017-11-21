//  Modal Context

(function (angular, undefined) {
    "use strict";

    function factory() {
        function AmenityContext() {
            var s = this;
            s.init();
        }

        var p = AmenityContext.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        p.set = function (obj) {
            var s = this;
            s.data.obj = obj;
            return s;
        };

        p.get = function () {
            var s = this;
            return s.data.obj;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function () {
            return new AmenityContext();
        };
    }

    angular
        .module("ui")
        .factory("modalContext", [factory]);
})(angular);
