//  Source: _lib\realpage\editable-form\js\models\editable-form.js
//  Editable Form

(function (angular) {
    "use strict";

    function factory(eventStream) {
        var index = 1;

        return function (cfg) {
            index++;

            if (!cfg || !cfg.formID) {
                logc("rpEditableFormModel: formID was not defined!");
            }

            var model = {
                events: eventStream(),
                formID: cfg.formID || "editable" + index,
                inEditMode: cfg.inEditMode === undefined ? false : cfg.inEditMode
            };

            model.publish = function (data) {
                model.events.publish(data);
            };

            model.subscribe = function (cb) {
                return model.events.subscribe(cb);
            };

            return model;
        };
    }

    angular
        .module("rpEditableForm")
        .factory("rpEditableFormModel", ["eventStream", factory]);
})(angular);

//  Source: _lib\realpage\editable-form\js\services\editable-form.js
//  Editable Form Service

(function (angular) {
    "use strict";

    function factory() {
        var svc = {
            store: {}
        };

        svc.register = function (formID, data) {
            if (!svc.store[formID]) {
                svc.store[formID] = data;
            }
            else {
                logc("rpEditableForm.register: formID " + formID + " is in use");
            }
        };

        svc.get = function (formID) {
            if (svc.store[formID]) {
                return svc.store[formID];
            }
            else {
                logc("rpEditableForm.get: " + formID + " is not a valid form ID");
            }
        };

        svc.remove = function (formID) {
            delete svc.store[formID];
        };

        return svc;
    }

    angular
        .module("rpEditableForm")
        .factory("rpEditableFormSvc", [factory]);
})(angular);

//  Source: _lib\realpage\editable-form\js\directives\editable-form.js
//  Editable Form Directive

(function (angular) {
    "use strict";

    function rpEditableForm(svc) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.$eval(attr.rpEditableForm);

            dir.init = function () {
                if (model) {
                    elem.addClass("read");
                    scope.rpEditableForm = dir;
                    svc.register(model.formID, dir);
                    scope.$on("$destroy", dir.destroy);

                    if (model.inEditMode) {
                        dir.edit();
                    }
                }
                else {
                    logc("rpEditableForm: Model is undefined!");
                }
            };

            dir.edit = function () {
                elem.addClass("edit").removeClass("read");
                model.publish(true);
            };

            dir.exit = function () {
                elem.removeClass("edit").addClass("read");
                model.publish(false);
            };

            dir.destroy = function () {
                svc.remove(model.formID);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpEditableForm")
        .directive("rpEditableForm", ["rpEditableFormSvc", rpEditableForm]);
})(angular);

//  Source: _lib\realpage\editable-form\js\directives\editable-form-exit.js
//  Editable Form Edit Directive

(function (angular) {
    "use strict";

    function rpEditableFormExit(svc) {
        function link(scope, elem, attr) {
            var dir = {},
                formID = scope.$eval(attr.rpEditableFormExit);

            dir.init = function () {
                if (formID) {
                    elem.on("click", dir.onClick);
                }
            };

            dir.onClick = function () {
                scope.$apply(function () {
                    svc.get(formID).exit();
                });
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpEditableForm")
        .directive("rpEditableFormExit", ["rpEditableFormSvc", rpEditableFormExit]);
})(angular);

//  Source: _lib\realpage\editable-form\js\directives\editable-form-edit.js
//  Editable Form Edit Directive

(function (angular) {
    "use strict";

    function rpEditableFormEdit(svc) {
        function link(scope, elem, attr) {
            var dir = {},
                formID = scope.$eval(attr.rpEditableFormEdit);

            dir.init = function () {
                if (formID) {
                    elem.on("click", dir.onClick);
                }
            };

            dir.onClick = function () {
                scope.$apply(function () {
                    svc.get(formID).edit();
                });
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpEditableForm")
        .directive("rpEditableFormEdit", ["rpEditableFormSvc", rpEditableFormEdit]);
})(angular);

