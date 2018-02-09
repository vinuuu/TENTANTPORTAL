//  Sample Fit Form Config

(function (angular) {
    "use strict";

    function factory(baseFormConfig, inputConfig, textareaConfig,menuConfig) {
        var model = baseFormConfig();

        model.field01 = inputConfig({
            id: "field01",
            fieldName: "field01"
        });
        model.field02 = inputConfig({
            id: "field02",
            fieldName: "field02",
            disabled: true
        });
        model.lastName = inputConfig({
            id: "lastName",
            fieldName: "lastName",
            disabled: true
        });
        model.Phone = inputConfig({
            id: "Phone",
            fieldName: "Phone"
        });
        model.Fax = inputConfig({
            id: "Fax",
            fieldName: "Fax"
        });
        model.UserName = inputConfig({
            id: "UserName",
            fieldName: "UserName"
        });
        model.EmailAddress = inputConfig({
            id: "EmailAddress",
            fieldName: "EmailAddress"
        });
        model.Password = inputConfig({
            id: "Password",
            fieldName: "Password"
        });
        model.RecoveryEmailID = inputConfig({
            id: "RecoveryEmailID",
            fieldName: "RecoveryEmailID"
        });
        model.RecoveryMobNumber = inputConfig({
            id: "RecoveryMobNumber",
            fieldName: "RecoveryMobNumber"
        });
        model.ChangePassword = inputConfig({
            id: "ChangePassword",
            dataType: "password",
            fieldName: "ChangePassword",
            minlength: 6,
            errorMsgs: [{
                name: "minlength",
                text: "This field should have at least six characters"
            }],
            modelOptions: {
                // updateOn: "blur",
                allowInvalid: true
            },
            onChange: model.getMethod("onPass1Change")
        });

        model.ConfirmPassword = inputConfig({
            id: "ConfirmPassword",
            dataType: "password",
            fieldName: "ConfirmPassword",
            errorMsgs: [{
                name: "checkPass2",
                text: "Passwords don't match"
            }],
            validators: {
                checkPass2: model.getMethod("checkPass2")
            },
            modelOptions: {
                // updateOn: "blur",
                allowInvalid: true
            },
            onChange: model.getMethod("onPass2Change")
        });
        model.securityquestion = menuConfig({
            nameKey: "securityQuesnID",
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
        .module("ui")
        .factory("settingsFormConfig", [
            "baseFormConfig",
            "rpFormInputTextConfig",
            "rpFormTextareaConfig",
            'rpFormSelectMenuConfig',
            factory
        ]);
})(angular);
