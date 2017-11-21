// Delete FloorPlanUnit Amenity Prop detail FloorPlans Service

(function (angular) {
    "use strict";

    function floorPlansAmenityAddedDeleteSvc($q, $http) {
        var svc, url, deferred;

        url = "/api/delete";

        svc = {
            abort: function () {
                if (deferred && deferred.resolve) {
                    deferred.resolve();
                }

                return svc;
            },

            deleteSelectedAmenity: function (paramData) {
                deferred = $q.defer();

                var reqUrl = url + "/" + paramData.amenityID;

                return $http({
                    data: {},
                    url: reqUrl,
                    cache: false,
                    method: "DELETE",
                    timeout: deferred.promise
                });
            }
        };

        return svc;
    }

    angular
        .module("ui")
        .factory("fpAmenityAddedDeleteSvc", ["$q", "$http", floorPlansAmenityAddedDeleteSvc]);
})(angular);
