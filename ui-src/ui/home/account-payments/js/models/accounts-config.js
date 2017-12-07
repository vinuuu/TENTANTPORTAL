(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID",
            onChange: model.getMethod("onaccountHistorySelection")
        });
        model.leaseData = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID",
            onChange: model.getMethod("onleaseDataSelection")
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
        .factory("accountsConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            Factory
        ]);
})(angular);