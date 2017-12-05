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
        return model;
    }

    angular
        .module("ui")
        .factory("baseModel", ["$state", factory]);
})(angular);