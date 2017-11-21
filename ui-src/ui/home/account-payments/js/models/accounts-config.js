(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
        });
        model.leaseData = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
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
        .factory("sampleSelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            Factory
        ]);
})(angular);