// Add Amenities Service

(function (angular) {
    "use strict";

    function amenitiesAddSvc($resource, $q, $http) {
        var svc = {},
            url, deferred, actions, defaults = {};

        svc.addAmenity = function (paramData) {
            var url = "/api/add",
                actions = {
                    save: {
                        method: "POST"
                    }
                };
            return $resource(url, defaults, actions);
        };

        return svc;
    }

    angular
        .module("uam")
        .factory("amenitiesAddSvc", [
            "$resource",
            "$q",
            "$http",
            amenitiesAddSvc
        ]);
})(angular);
