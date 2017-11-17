//  Demo Form Config

(function(angular, undefined) {
    "use strict";

    function factory(baseFormConfig, radioConfig, menuConfig) {
        var model = baseFormConfig();
        //pettu
        model.genRadio = function(name, list) {
            list.forEach(function(item) {
                model[item.id] = radioConfig({
                    name: name
                });
            });
        };


        model.securityquestion = menuConfig({
            nameKey: "securityQuesnName",
            valueKey: "securityQuesnID"
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
        .module("uam")
        .factory("loginFormConfig", ["baseFormConfig", "rpFormInputRadioConfig", "rpFormSelectMenuConfig", factory]);
})(angular);