(function(angular) {
    "use strict";

    function Factory(baseFormConfig, menuConfig, inputConfig) {
        var model = baseFormConfig();

        model.paymentType = menuConfig({
            nameKey: "paymentTypeName",
            valueKey: "paymentTypeNameID"
        });

        model.secondSelect = menuConfig({
            nameKey: "leaseName",
            valueKey: "leaseID"
        });
        model.lease = inputConfig({
            id: "Pay Amount",
            fieldName: "Pay Amount"
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