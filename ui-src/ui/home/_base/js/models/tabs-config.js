//  Workspaces Config Model

(function(angular, undefined) {
    "use strict";

    function factory($state) {
        var model = {};

        model.error = function(response) {
            $state.go("error", {
                errorCode: response.status
            });

        };
        // model.getTenantStatement = function(leaseid, Fromdate, ToDate) {
        //     return {
        //         "request": {
        //             "operation": {
        //                 "content": {
        //                     "function": {
        //                         "getTenantStatement": {
        //                             "leaseid": leaseid,
        //                             "fromdate": {
        //                                 "year": date.year,
        //                                 "month": date.month,
        //                                 "day": date.day
        //                             },
        //                             "todate": {
        //                                 "year": ToDate.year,
        //                                 "month": ToDate.month,
        //                                 "day": ToDate.day
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     };
        // }

        return model;
    }

    angular
        .module("ui")
        .factory("baseModel", ["$state", factory]);
})(angular);