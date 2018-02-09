angular.module("rpWizard", []);

//  Source: _lib\realpage\wizard\js\directives\wizard-nav.js
//  Wizard Nav Directive

(function (angular) {
    "use strict";

    function rpWizardNav() {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                scope.rpWizardNav = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getBarStyle = function () {
                return {
                    width: dir.getBarWidth() + "%"
                };
            };

            dir.getBarWidth = function () {
                var totalStepCount = model.getStepCount(),
                    currentStepIndex = model.getCurrentStepIndex();

                return (currentStepIndex * 100 / (totalStepCount - 1));
            };

            dir.getTrackLeft = function () {
                return (100 / (2 * model.getStepCount()));
            };

            dir.getTrackStyle = function () {
                return {
                    left: dir.getTrackLeft() + "%",
                    width: dir.getTrackWidth() + "%"
                };
            };

            dir.getTrackWidth = function () {
                return 100 - (2 * dir.getTrackLeft());
            };

            dir.goTo = function (step) {
                if (!step.isDisabled()) {
                    model.goTo(step);
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                scope.rpWizardNav = undefined;
                dir = undefined;
                scope = undefined;
                model = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/wizard/templates/wizard-nav.html"
        };
    }

    angular
        .module("rpWizard")
        .directive("rpWizardNav", [rpWizardNav]);
})(angular);

//  Source: _lib\realpage\wizard\js\directives\wizard-step.js
//  Wizard Step Directive

(function (angular) {
    "use strict";

    function rpWizardStep(wizardNavModelFactory) {
        function link(scope, elem, attr) {
            var dir = {},
                wizModel = wizardNavModelFactory.get(attr.rpWizardId);

            dir.init = function () {
                scope.rpWizardStep = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpWizard")
        .directive("rpWizardStep", ["rpWizardNavModelFactory", rpWizardStep]);
})(angular);

//  Source: _lib\realpage\wizard\js\directives\wizard-action.js
//  Wizard Action Directive

(function (angular) {
    "use strict";

    function rpWizardAction(modelFactory) {
        function link(scope, elem, attr) {
            var model,
                dir = {},
                click = "click.rpWizardAction";

            dir.init = function () {
                model = dir.bindClick().getModel();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.bindClick = function () {
                elem.on(click, dir.clickHandler);
                return dir;
            };

            dir.getModel = function () {
                var data = scope.$eval(attr.rpWizardAction);
                return modelFactory.get(data.wizardModelID);
            };

            dir.clickHandler = function () {
                var methodName = dir.getClickMethod();
                dir[methodName]();
            };

            dir.getClickMethod = function () {
                var isPrev = elem.hasClass("prev-step");
                return isPrev ? "goToPrevStep" : "goToNextStep";
            };

            dir.goToPrevStep = function () {
                model.goToPrevStep();
            };

            dir.goToNextStep = function () {
                model.goToNextStep();
            };

            dir.destroy = function () {
                elem.off(click);
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
                click = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpWizard")
        .directive("rpWizardAction", [
            "rpWizardNavModelFactory",
            rpWizardAction
        ]);
})(angular);

//  Source: _lib\realpage\wizard\js\models\wizard-nav-step.js
//  Wizard Nav Step Model

(function (angular, undefined) {
    "use strict";

    function factory($state, $location) {
        function WizardNavStepModel() {
            var s = this;
            s.init();
        }

        var p = WizardNavStepModel.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                last: false,
                first: false,
                active: false,
                visited: false,
                complete: false,
                disabled: false,
                index: undefined
            };

            s.validators = {};
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.setValidators = function (validators) {
            var s = this;
            angular.extend(s.validators, validators);
            return s;
        };

        // Getters

        p.getState = function () {
            var s = this;
            return {
                last: s.data.last,
                first: s.data.first,
                active: s.data.active,
                visited: s.data.visited,
                complete: s.data.complete,
                disabled: s.data.disabled
            };
        };

        p.getID = function () {
            var s = this;
            return s.data.id;
        };

        p.getIndex = function () {
            var s = this;
            return s.data.index;
        };

        // Assertions

        p.is = function (obj) {
            var s = this;
            return obj.getNumber() == s.data.number;
        };

        p.isActive = function () {
            var s = this;
            return s.data.active;
        };

        p.isComplete = function () {
            var s = this;
            return s.data.complete;
        };

        p.isDisabled = function () {
            var s = this;
            return s.data.disabled;
        };

        p.isFirst = function () {
            var s = this;
            return s.data.first;
        };

        p.isLast = function () {
            var s = this;
            return s.data.last;
        };

        p.isVisited = function () {
            var s = this;
            return s.data.visited;
        };

        p.isValid = function () {
            var s = this,
                bool = true;

            angular.forEach(s.validators, function (validator) {
                bool = bool && validator();
            });

            return bool;
        };

        // Actions

        p.activate = function () {
            var s = this;
            s.data.active = true;
            return s;
        };

        p.complete = function () {
            var s = this;
            s.data.complete = true;
            return s;
        };

        p.deactivate = function () {
            var s = this;
            s.visited();
            s.data.active = false;
            return s;
        };

        p.disable = function () {
            var s = this;
            s.data.disabled = true;
            return s;
        };

        p.enable = function () {
            var s = this;
            s.data.disabled = false;
            return s;
        };

        p.visited = function () {
            var s = this;
            s.data.visited = true;
            return s;
        };

        p.goTo = function () {
            var s = this;
            if (s.data.sref) {
                $state.go(s.data.sref);
            }
            else if (s.data.url) {
                $location.url(s.data.url);
            }
            return s;
        };

        p.incomplete = function () {
            var s = this;
            s.data.complete = false;
            return s;
        };

        p.destroy = function () {
            var s = this;
        };

        return function (data) {
            return (new WizardNavStepModel()).setData(data);
        };
    }

    angular
        .module("rpWizard")
        .factory("rpWizardNavStepModel", ["$state", "$location", factory]);
})(angular);

//  Source: _lib\realpage\wizard\js\models\wizard-nav.js
//  Wizard Nav Model

(function (angular, undefined) {
    "use strict";

    function factory(wizardNavStep) {
        function WizardNavModel() {
            var s = this;
            s.init();
        }

        var p = WizardNavModel.prototype;

        p.init = function () {
            var s = this;
            s.stack = {};
            s.stepsList = [];
        };

        // Getters

        p.getStepCount = function () {
            var s = this;
            return s.stepsList.length;
        };

        p.getCurrentStepIndex = function () {
            var s = this;
            return s.currentStep.getIndex();
        };

        // Setters

        p.setSteps = function (steps) {
            var s = this,
                lastIndex = steps.length - 1;

            steps.forEach(function (stepData, index) {
                var step = wizardNavStep();
                s.updateStepData(stepData, index, lastIndex);

                s.stack[stepData.id] = step;
                s.stepsList.push(step.setData(stepData));

                if (step.isActive()) {
                    s.currentStep = step;
                }
            });

            return s;
        };

        p.setValidators = function (stepID, validators) {
            var s = this;
            s.stack[stepID].setValidators(validators);
            return s;
        };

        // Assertions

        p.hasNext = function () {
            var s = this;
            return !s.currentStep.isLast();
        };

        // Actions

        p.completeCurrentStep = function () {
            var s = this;
            s.currentStep.complete();
            return s;
        };

        p.goTo = function (step) {
            var s = this,
                newIndex = step.getIndex();

            if (!s.currentStep.isValid()) {
                return s;
            }

            s.currentStep.deactivate();
            s.currentStep = step.activate().goTo();

            if (s.stepsList[newIndex + 1]) {
                s.stepsList[newIndex + 1].enable();
            }

            return s;
        };

        p.goToNextStep = function () {
            var s = this,
                newIndex = s.currentStep.getIndex() + 1;

            if (!s.currentStep.isValid()) {
                return s;
            }

            if (!s.currentStep.isLast()) {
                s.currentStep.deactivate();
                s.currentStep = s.stepsList[newIndex].activate().goTo();
            }

            return s;
        };

        p.goToPrevStep = function () {
            var s = this,
                newIndex = s.currentStep.getIndex() - 1;

            if (!s.currentStep.isValid()) {
                return s;
            }

            if (!s.currentStep.isFirst()) {
                s.currentStep.deactivate();
                s.currentStep = s.stepsList[newIndex].activate().goTo();
            }

            return s;
        };

        p.updateStepData = function (stepData, index, lastIndex) {
            return angular.extend(stepData, {
                index: index,
                number: index + 1,
                first: index === 0,
                last: index == lastIndex
            });
        };

        p.destroyStep = function (step) {
            step.destroy();
        };

        p.destroy = function () {
            var s = this;
            s.stepsList.forEach(s.destroyStep);
            s.stepsList.flush();
            s.stepsList = undefined;
        };

        return function () {
            return new WizardNavModel();
        };
    }

    angular
        .module("rpWizard")
        .factory("rpWizardNavModel", ["rpWizardNavStepModel", factory]);
})(angular);

//  Source: _lib\realpage\wizard\js\services\wizard-nav-factory.js
//  Wizard Nav Model Factory

(function (angular) {
    "use strict";

    function WizardNavModelFactory(wizardNavModel) {
        var svc = this;

        svc.storage = {};

        svc.get = function (id) {
            return svc.storage[id] ? svc.storage[id] : svc.gen(id);
        };

        svc.gen = function (id) {
            svc.storage[id] = wizardNavModel();
            return svc.storage[id];
        };

        svc.destroy = function (id) {
            svc.storage[id].destroy();
            delete svc.storage[id];
        };
    }

    angular
        .module("rpWizard")
        .service("rpWizardNavModelFactory", [
            "rpWizardNavModel",
            WizardNavModelFactory
        ]);
})(angular);

//  Source: _lib\realpage\wizard\js\templates\templates.inc.js
angular.module("rpWizard").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/wizard/templates/wizard-nav.html",
"<div class=\"rp-wizard-nav\"><div class=\"rp-wizard-progress-bar\" ng-style=\"rpWizardNav.getTrackStyle()\"><span class=\"bar\" ng-style=\"rpWizardNav.getBarStyle()\"></span></div><ul class=\"rp-wizard-nav-steps\"><li ng-class=\"stepModel.getState()\" ng-click=\"rpWizardNav.goTo(stepModel)\" ng-repeat=\"stepModel in model.stepsList\" class=\"rp-wizard-nav-cell rp-wizard-nav-step\"><span class=\"rp-wizard-nav-step-link\"><span class=\"rp-wizard-nav-step-number\">{{stepModel.data.number}}</span> <span class=\"rp-wizard-nav-step-text\">{{stepModel.data.text}}</span></span></li></ul></div>");
}]);
