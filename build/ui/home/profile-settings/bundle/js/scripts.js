//  Source: ui\home\profile-settings\_base\js\_bundle.inc
//  Source: ui\home\profile-settings\_base\js\controllers\profile-settings.js
//  Profile Settings Controller

(function (angular, undefined) {
    "use strict";

    function ProfileSettingsCtrl($scope,formConfig) {
        var vm = this;
        vm.formConfig = {};

        vm.init = function () {
            vm.message = "Welcome to Floor Plan Units";
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
            vm.formConfig = formConfig;
            formConfig.setMethodsSrc(vm);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("ui")
        .controller("ProfileSettingsCtrl", [
            "$scope",
            "profile-settings-config",
            ProfileSettingsCtrl
        ]);
})(angular);

//  Source: ui\home\profile-settings\_base\js\models\form-config.js
(function(angular) {
    "use strict";

    function factory(baseFormConfig, menuConfig, inputConfig, textareaConfig) {
        var model = baseFormConfig();

        model.dba = inputConfig({
            id: "DBA",
            fieldName: "DBA",
            placeholder: "Enter DBA",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "DBA field is required" //translate('form_allocation_name_required')
            }]
        });
        model.firstname = inputConfig({
            id: "FirstName",
            fieldName: "FirstName",
            placeholder: "Enter First Name",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "First Name field is required" //translate('form_allocation_name_required')
            }]
        });
        model.lastname = inputConfig({
            id: "LastName",
            fieldName: "LastName",
            placeholder: "Enter Last Name",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Last Name field is required" //translate('form_allocation_name_required')
            }]
        });
        model.lastname = inputConfig({
            id: "LastName",
            fieldName: "LastName",
            placeholder: "Enter Last Name",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Last Name field is required" //translate('form_allocation_name_required')
            }]
        });
        model.phone = inputConfig({
            id: "Phone",
            fieldName: "Phone",
            placeholder: "Enter Phone",
            maxlength: 75,
            readonly: false,
            required: false,
            pattern: /^[+]?[0-9]{0,1}[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Phone field is required" //translate('form_allocation_name_required')
            }]
        });
        model.fax = inputConfig({
            id: "Fax",
            fieldName: "Fax",
            placeholder: "Enter Fax",
            maxlength: 75,
            readonly: false,
            required: false,
            pattern: /([\(\+])?([0-9]{1,3}([\s])?)?([\+|\(|\-|\)|\s])?([0-9]{2,4})([\-|\)|\.|\s]([\s])?)?([0-9]{2,4})?([\.|\-|\s])?([0-9]{4,8})/,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Fax field is required" //translate('form_allocation_name_required')
            }]
        });
        model.streetaddress = inputConfig({
            id: "StreetAddress",
            fieldName: "StreetAddress",
            placeholder: "Enter Street Address",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Street Address field is required" //translate('form_allocation_name_required')
            }]
        });
        model.suite = inputConfig({
            id: "Suite",
            fieldName: "Suite",
            placeholder: "Enter Suite",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Suite field is required" //translate('form_allocation_name_required')
            }]
        });
        model.city = inputConfig({
            id: "City",
            fieldName: "City",
            placeholder: "Enter City",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "City is required" //translate('form_allocation_name_required')
            }]
        });
        model.state = inputConfig({
            id: "State",
            fieldName: "State",
            placeholder: "Enter State",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "State is required" //translate('form_allocation_name_required')
            }]
        });
        model.zip = inputConfig({
            id: "Zip",
            fieldName: "Zip",
            placeholder: "Enter Zip Code",
            maxlength: 75,
            readonly: false,
            required: false,
            modelOptions: {
                updateOn: "blur"
            },

            errorMsgs: [{
                name: "required",
                text: "Zip Code is required" //translate('form_allocation_name_required')
            }]
        });


        return model;
    }

    angular
        .module("ui.profieSettings")
        .factory("profile-settings-config", [
            "baseFormConfig",
            "rpFormSelectMenuConfig",
            "rpFormInputTextConfig",
            'rpFormTextareaConfig',
            factory
        ]);
})(angular);



