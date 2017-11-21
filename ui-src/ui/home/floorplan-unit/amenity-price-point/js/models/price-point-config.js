(function (angular) {
    "use strict";

    function factory(baseFormConfig, menuConfig) {
        var model = baseFormConfig();

        model.pricePoint = menuConfig({
            nameKey: "price",
            valueKey: "pricePointID",
            onChange: model.methods.get("onSelectedPricePointChange")
        });

        model.defaultOptions = {
            pricePoint: {
                price: "Select a price point",
                pricePointID: ""
            }
        };

        model.setOptions = function (fieldName, fieldOptions) {
            var defOption = model.defaultOptions[fieldName];

            fieldOptions = [defOption].concat(fieldOptions);

            if (model[fieldName]) {
                model[fieldName].setOptions(fieldOptions);
            }
            else {
                logc("pricePoint.setOptions: " + fieldName + " is not a valid field name!");
            }
            return model;
        };

        return model;
    }

    angular
        .module("ui")
        .factory("pricePointConfig", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            factory
        ]);
})(angular);
