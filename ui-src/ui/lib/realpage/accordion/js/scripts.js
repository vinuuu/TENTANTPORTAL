angular.module("rpAccordion", []);

//  Source: _lib\realpage\accordion\js\directives\accordion-panel.js
//  Accordion Panel Directive

(function (angular, undefined) {
    "use strict";

    function rpAccordionPanel(timeout, accordionSvc) {
        var index = 0;

        function link(scope, elem, attr) {
            index++;

            var dir = {};

            dir.init = function () {
                var acID = dir.getAcID(),
                    config = dir.getConfig();

                dir.acID = acID;
                dir.stateReady = false;
                dir.panelID = "panel" + index;
                dir.click = "click." + dir.panelID;

                dir.model = accordionSvc.get(acID);
                dir.model.register(dir.panelID, dir);

                timeout(dir.initTitle, 100);
                scope[config.instName] = dir;

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initState = function () {
                var outerHeight = dir.title.outerHeight();

                if (outerHeight === 0 || dir.stateReady) {
                    return;
                }

                dir.stateReady = true;

                dir.state = {
                    isOpen: elem.hasClass("expand")
                };

                if (!dir.state.isOpen) {
                    elem.css({
                        overflow: "hidden",
                        height: outerHeight
                    });

                    dir.title.addClass("collapsed");
                }
            };

            dir.initTitle = function () {
                dir.title = elem.children(".rp-accordion-panel-title");
                dir.title.on(dir.click, dir.toggle);
                dir.initState();
            };

            dir.getAcID = function () {
                var parSel = "[rp-accordion]:first";
                return elem.parents(parSel).attr("rp-accordion");
            };

            dir.getConfig = function () {
                dir.config = angular.extend({
                    onAfterOpen: angular.noop,
                    onAfterClose: angular.noop,
                    onBeforeOpen: angular.noop,
                    onBeforeClose: angular.noop,
                    instName: "rpAcPanel" + index
                }, scope.$eval(attr.rpAccordionPanel) || {});

                return dir.config;
            };

            dir.toggle = function () {
                var open = dir.state.isOpen;
                dir.model[open ? "collapse" : "expand"](dir.panelID);
            };

            dir.expand = function () {
                if (!dir.state.isOpen) {
                    dir.getConfig().onBeforeOpen();
                    var ht = elem[0].scrollHeight;
                    dir.animHeight(ht);
                    dir.state.isOpen = true;
                    dir.title.removeClass("collapsed");
                }
            };

            dir.collapse = function () {
                if (dir.state.isOpen) {
                    dir.getConfig().onBeforeClose();
                    var ht = dir.title.outerHeight();
                    elem.css("overflow", "hidden");
                    dir.animHeight(ht);
                    dir.state.isOpen = false;
                    dir.title.addClass("collapsed");
                }
            };

            dir.animHeight = function (ht) {
                elem.animate({
                    height: ht
                }, 250, dir.onAnimComplete);
            };

            dir.onAnimComplete = function () {
                if (dir.state.isOpen) {
                    elem.css({
                        height: "",
                        overflow: ""
                    });

                    dir.getConfig().onAfterOpen();
                }
                else {
                    dir.getConfig().onAfterClose();
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                if (dir.title) {
                    dir.title.off(dir.click);
                }
                dir.model.remove(dir.panelID);
                delete scope[dir.config.name];

                if (dir.model.isEmpty()) {
                    accordionSvc.destroy(dir.acID);
                }

                dir = undefined;
                attr = undefined;
                elem = undefined;
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
        .module("rpAccordion")
        .directive("rpAccordionPanel", [
            "timeout",
            "rpAccordionSvc",
            rpAccordionPanel
        ]);
})(angular);

//  Source: _lib\realpage\accordion\js\models\accordion.js
//  Accordion Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function AccordionModel() {
            var s = this;
            s.init();
        }

        var p = AccordionModel.prototype;

        p.init = function () {
            var s = this;
            s.panels = {};
        };

        p.register = function (id, panel) {
            var s = this;
            s.panels[id] = panel;
            return s;
        };

        p.remove = function (id) {
            var s = this;
            delete s.panels[id];
            return s;
        };

        p.expand = function (id) {
            var s = this;

            angular.forEach(s.panels, function (panel, key) {
                var bool = key == id;
                panel[bool ? "expand" : "collapse"]();
            });

            return s;
        };

        p.collapse = function (id) {
            var s = this;
            s.panels[id].collapse();
            return s;
        };

        p.isEmpty = function () {
            var s = this;
            return Object.keys(s.panels).length === 0;
        };

        p.destroy = function () {
            var s = this;
            s.panels = undefined;
        };

        return function () {
            return new AccordionModel();
        };
    }

    angular
        .module("rpAccordion")
        .factory("rpAccordionModel", [factory]);
})(angular);

//  Source: _lib\realpage\accordion\js\services\accordion.js
//  Accordion Service

(function (angular, undefined) {
    "use strict";

    function AccordionSvc(accordionModel) {
        var svc = this;

        svc.models = {};

        svc.get = function (id) {
            svc.models[id] = svc.models[id] || accordionModel();
            return svc.models[id];
        };

        svc.destroy = function (id) {
            delete svc.models[id];
        };
    }

    angular
        .module("rpAccordion")
        .service("rpAccordionSvc", [
            "rpAccordionModel",
            AccordionSvc
        ]);
})(angular);
