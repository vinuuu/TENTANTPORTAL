(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig, inputConfig) {
        var model = baseFormConfig();

        model.accountHistory = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
        });

        model.secondSelect = menuConfig({
            nameKey: "accountHisrotyName",
            valueKey: "accountHisrotyNameID"
        });
        model.lease = inputConfig({
            id: "Invoice",
            fieldName: "Invoice"
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
        .factory("viewpaySelectMenuFormConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig", "rpFormInputTextConfig",
            Factory
        ]);
})(angular);