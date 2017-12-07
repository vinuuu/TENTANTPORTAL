(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.leaseIdList = menuConfig({
            nameKey: "leaseName",
            valueKey: "leaseID",
            onChange: model.getMethod("onLeaseIdChange")
        });
        model.dateRange = menuConfig({
            nameKey: "dateRangeName",
            valueKey: "dateRangeID",
            onChange: model.getMethod("onDataRange")
        });

        model.setOptions = function(fieldName, fieldOptions) {
            if (model[fieldName]) {
                model[fieldName].setOptions(fieldOptions);
            } else {
                return model;
            }
        };

        return model;
    }


    angular
        .module("ui")
        .factory("statementConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            Factory
        ]);
})(angular);