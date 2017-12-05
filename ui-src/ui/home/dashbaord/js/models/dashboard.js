(function() {
    'use strict';



    function factory(dashboardSvc, $http, busyIndicatorModel) {
        var model = {},
            busyIndicator,
            apiReady = false,
            response = {};

        model.init = function() {
            busyIndicator = model.busyIndicator = busyIndicatorModel();
            return model;
        };
        model.toggleGridState = function(flg) {
            if (flg) {
                model.apiReady = false;
                busyIndicator.busy();
            } else {
                model.apiReady = true;
                busyIndicator.off();
            }

            return model;
        };

        model.getdashboardList = function() {
            model.toggleGridState(true);

            var obj = {
                "request": {
                    "operation": {
                        "content": {
                            "function": {
                                "readByQuery": {
                                    "object": "leaseoccupancy",
                                    "fields": "",
                                    "query": "",
                                    "returnFormat": "json"
                                }
                            }
                        }
                    }
                }
            };
            dashboardSvc.getLeaseList(obj).then(function(response) {
                model.toggleGridState(false);
                if (response.data && response.data.length > 0) {

                    model.tenantlist = response.data;
                }

                // // var gg = angular.element(".acr-content2")[0].offsetHeight;
                // var element = angular.element(document.querySelector('#myDiv'));
                // var height = element[0].offsetHeight;

            });

        };



        model.bindtenantdata = function(response) {
            model.list = response.records;
        };
        return model.init();
    }
    angular
        .module('ui')
        .factory('dashboardMdl', factory);

    factory.$inject = ['dashboardSvc', '$http', 'rpBusyIndicatorModel'];
})();