angular.module("rpCollapsiblePanel", []);

//  Source: _lib\realpage\collapsible-panel\js\directives\collapsible-panel.js
//  Collapsible Panel Directive

(function (angular, undefined) {
    "use strict";

    function rpCollapsiblePanel($timeout, panelSvc) {
        var index = 0;

        function link(scope, elem, attr) {
            index++;

            var dir = {},
                name = "rpCollapsiblePanel" + index;

            dir.init = function () {
                dir.state = {
                    isOpen: true
                };

                dir.initConfig();
                name = dir.config.instName;
                dir.id = dir.config.panelId;

                scope[name] = dir;
                $timeout(dir.setState, 100);
                panelSvc.registerPanel(dir.id, dir);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initConfig = function () {
                var config = scope.$eval(attr.rpCollapsiblePanel);

                dir.config = angular.extend({
                    panelId: name,
                    instName: name,
                    onChange: angular.noop,
                    onAfterOpen: angular.noop,
                    onAfterClose: angular.noop,
                    onBeforeOpen: angular.noop,
                    onBeforeClose: angular.noop
                }, config || {});
            };

            // Setters

            dir.setState = function () {
                var css = {
                    height: 0,
                    overflow: "hidden"
                };

                if (elem.hasClass("collapse-panel")) {
                    dir.state.isOpen = false;
                    elem.css(css).removeClass("collapse-panel").addClass("collapsed");
                }
            };

            // Assertions

            dir.isOpen = function () {
                return dir.state.isOpen;
            };

            // Actions

            dir.animHeight = function (height, time) {
                elem.animate({
                    height: height
                }, time || 300, dir.onAnimComplete);
            };

            dir.closePanel = function () {
                dir.config.onBeforeClose();
                dir.state.isOpen = false;
                elem.css("overflow", "hidden").addClass("collapsed");
                dir.animHeight(0);
            };

            dir.onAnimComplete = function () {
                var css,
                    isOpen = dir.isOpen();

                if (isOpen) {
                    elem.css({
                        height: "",
                        overflow: ""
                    });
                }

                dir.config[isOpen ? "onAfterOpen" : "onAfterClose"]();
            };

            dir.openPanel = function () {
                dir.config.onBeforeOpen();
                dir.state.isOpen = true;
                dir.animHeight(elem[0].scrollHeight);
                elem.removeClass("collapsed");
            };

            dir.toggle = function () {
                dir[dir.isOpen() ? "closePanel" : "openPanel"]();
                dir.config.onChange(dir.state.isOpen);
            };

            dir.destroy = function () {
                dir.destWatch();
                delete scope[name];
                panelSvc.removePanel(dir.id);

                dir = undefined;
                attr = undefined;
                elem = undefined;
                name = undefined;
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
        .module("rpCollapsiblePanel")
        .directive("rpCollapsiblePanel", [
            "$timeout",
            "rpCollapsiblePanelSvc",
            rpCollapsiblePanel
        ]);
})(angular);

//  Source: _lib\realpage\collapsible-panel\js\directives\collapsible-panel-toggle.js
//  Collapsible Panel Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpCollapsiblePanelToggle($timeout, panelSvc) {
        var index = 0;

        function link(scope, elem, attr) {
            index++;

            var dir = {},
                click = "click.rpCollapsiblePanel",
                name = "rpCollapsiblePanel" + index;

            dir.init = function () {
                dir.initConfig();
                name = dir.config.instName || name;
                dir.id = dir.config.panelId || name;

                scope[name] = dir;
                elem.on(click, dir.toggle);
                $timeout(dir.setState, 150);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initConfig = function () {
                var config = scope.$eval(attr.rpCollapsiblePanelToggle) || {};

                dir.config = angular.extend({
                    panelId: name,
                    instName: name,
                    onOpen: angular.noop,
                    onClose: angular.noop
                }, config || {});
            };

            // Actions

            dir.execCallback = function () {
                var open = panelSvc.isOpen(dir.id);
                dir.config[open ? "onOpen" : "onClose"]();
            };

            dir.toggle = function () {
                if (!dir.isBusy) {
                    dir.isBusy = true;
                    panelSvc.togglePanel(dir.id);
                    dir.setState().execCallback();

                    $timeout(function () {
                        dir.isBusy = false;
                    }, 310);
                }
            };

            dir.setState = function () {
                var open = panelSvc.isOpen(dir.id);
                elem[open ? "removeClass" : "addClass"]("collapsed");
                return dir;
            };

            dir.destroy = function () {
                elem.off(click);
                dir.destWatch();
                delete scope[name];

                dir = undefined;
                attr = undefined;
                elem = undefined;
                name = undefined;
                scope = undefined;
                click = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpCollapsiblePanel")
        .directive("rpCollapsiblePanelToggle", [
            "$timeout",
            "rpCollapsiblePanelSvc",
            rpCollapsiblePanelToggle
        ]);
})(angular);


//  Source: _lib\realpage\collapsible-panel\js\services\collapsible-panel.js
//  Collapsible Panel Service

(function (angular, undefined) {
    "use strict";

    function CollapsiblePanel() {
        var svc = this,
            panels = {};

        svc.isOpen = function (panelId) {
            if (!panels[panelId]) {
                logc("rpCollapsiblePanelSvc.isOpen: Panel with panelId %s was not found!", panelId);
                return false;
            }

            return panels[panelId].isOpen();
        };

        svc.registerPanel = function (panelId, panel) {
            panels[panelId] = panel;
        };

        svc.removePanel = function (panelId) {
            delete panels[panelId];
        };

        svc.togglePanel = function (panelId) {
            if (panels[panelId]) {
                panels[panelId].toggle();
            }
        };
    }

    angular
        .module("rpCollapsiblePanel")
        .service("rpCollapsiblePanelSvc", [CollapsiblePanel]);
})(angular);

