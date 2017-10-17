//  FloorPlanUnit Amenity Prop detail FloorPlans Data Service

(function (angular) {
    "use strict";

    function factory($resource, $window) {
       
        var svc = {};

        svc.url = {
            urlParm: "/api/floorplan-unit/amenity-property-detail-floorplans"
        };
        // /api/floorplan-unit/amenity-property-detail-floorplans/:propID/:PMCID

        svc.requests = {
            getReq: null
        };

         svc.getDataReq = function(paramData) {
            var params = {
                amenityID: paramData.amenityID, 
                PMCID: paramData.PMCID 
            };

            var url = svc.url.urlParm,
                actions = {
                    get: {
                        method: "GET",
                        cancellable: true
                    }
                };

            return $resource(url, params, actions).get();
        };
        
        svc.getData = function (paramData) {
            svc.requests.getReq = svc.getDataReq(paramData);
            return svc.requests.getReq.$promise;
        };

        return svc;
    }

    angular
        .module("uam")
        .factory("fpDataSvc", ["$resource","$window", factory]);
})(angular);
