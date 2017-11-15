//  Demo Form Config

(function(angular, undefined) {
    "use strict";

    function factory(baseFormConfig, radioConfig) {
        var model = baseFormConfig();
        //pettu
        model.genRadio = function(name, list) {
            list.forEach(function(item) {
                model[item.id] = radioConfig({
                    name: name
                });
            });
        };

        return model;
    }

    angular
        .module("uam")
        .factory("loginFormConfig", ["baseFormConfig", "rpFormInputRadioConfig", factory]);
})(angular);