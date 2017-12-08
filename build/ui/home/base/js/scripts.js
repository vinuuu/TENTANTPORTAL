//  Source: ui\home\_base\js\controllers\home.js
//  Home Controller

(function(angular, undefined) {
    "use strict";

    function HomeCtrl($scope, tabsModel) {
        var vm = this;

        vm.init = function() {

        };

        vm.destroy = function() {
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("HomeCtrl", ["$scope", "baseModel", HomeCtrl]);
})(angular);


//  Source: ui\home\_base\js\models\tabs-config.js
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
