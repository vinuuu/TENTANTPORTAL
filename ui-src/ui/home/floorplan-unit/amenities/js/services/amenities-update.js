// Update Amenities Service

(function (angular) {
    "use strict";

    function amenitiesUpdateSvc($q, $http) {
        var svc, url, deferred;

        url = "/api/update";

        svc = {
            abort: function () {
                if (deferred && deferred.resolve) {
                    deferred.resolve();
                }

                return svc;
            },

            updateAmenity: function (paramData) {
                deferred = $q.defer();

                var reqUrl = url + "/" + paramData.amenityID;

                return $http({
                    data: {},
                    url: reqUrl,
                    cache: false,
                    method: "PUT",
                    timeout: deferred.promise
                });
            }

        };

        return svc;
    }

    angular
        .module("uam")
        .factory("amenitiesUpdateSvc", ["$q", "$http", amenitiesUpdateSvc]);
})(angular);
