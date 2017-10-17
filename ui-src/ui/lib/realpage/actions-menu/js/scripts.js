//  Source: _lib\realpage\actions-menu\js\_bundle.inc
angular.module("rpActionsMenu", []);

//  Source: _lib\realpage\actions-menu\js\directives\actions-menu-panel.js
//  Actions Menu Panel Directive

(function (angular) {
    "use strict";

    function rpActionsMenuPanel() {
        function link(scope, elem, attr) {}

        return {
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/actions-menu/templates/actions-menu-panel.html"
        };
    }

    angular
        .module("rpActionsMenu")
        .directive("rpActionsMenuPanel", [rpActionsMenuPanel]);
})(angular);

//  Source: _lib\realpage\actions-menu\js\directives\actions-menu.js
//  Actions Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpActionsMenu($rootScope, $compile, $timeout) {
        var body,
            index = 1;

        function link(scope, elem, attr) {
            var panel,
                dir = {},
                model = scope.$eval(attr.model),
                click = "click.actionsMenu" + index++,
                panelHtml = "<rp-actions-menu-panel model='actionsMenuModel' />";

            dir.init = function () {
                if (model) {
                    $timeout(dir.initBody);
                    scope.rpActionsMenu = dir;
                    dir.initElem().loadContext().initPanel();
                }
                else {
                    logc("rpActionsMenu.init: Model is undefined!");
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initBody = function () {
                body = body || angular.element("body");
            };

            dir.initElem = function () {
                elem.on(click, dir.togglePanelHandler);
                elem.html(model.getToggleText()).addClass(model.getToggleClassNames());
                return dir;
            };

            dir.initPanel = function () {
                var newScope = $rootScope.$new();
                newScope.model = model;
                panel = $compile(panelHtml)(newScope);
                $timeout(dir.appendPanel);
            };

            dir.appendPanel = function () {
                body.append(panel);
            };

            dir.loadContext = function () {
                model.forEachAction(function (action) {
                    action.loadContext(scope);
                });

                return dir;
            };

            dir.togglePanel = function (ev) {
                model.togglePanel().setPanelPosition({
                    top: elem.offset().top + model.getOffsetTop(),
                    left: elem.offset().left + model.getOffsetLeft()
                });

                if (model.panelIsVisible()) {
                    $timeout(dir.bindHide, 10);
                }
                else {
                    body.off(click);
                }
            };

            dir.togglePanelHandler = function (ev) {
                scope.$apply(function () {
                    dir.togglePanel(ev);
                });
            };

            dir.hidePanel = function () {
                scope.$apply(model.hidePanel.bind(model));
            };

            dir.bindHide = function () {
                body.one(click, dir.hidePanel);
            };

            dir.destroy = function () {
                body.off(click);
                model.hidePanel();
                elem.off();
                panel.remove();
                dir.destWatch();
                dir = undefined;
                elem = undefined;
                panel = undefined;
                model = undefined;
                click = undefined;
                scope = undefined;
                panelHtml = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("app")
        .directive("rpActionsMenu", [
            "$rootScope",
            "$compile",
            "$timeout",
            rpActionsMenu
        ]);
})(angular);


//  Source: _lib\realpage\actions-menu\js\models\action.js
//  Actions Menu Action Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function MenuAction() {
            var s = this;
            s.init();
        }

        var p = MenuAction.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            return s;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data || {};
            return s;
        };

        // Actions

        p.loadContext = function (dataSrc) {
            var s = this;
            s.data.context = s.data.context || {};

            if (s.data.contextKeys) {
                s.data.contextKeys.forEach(function (key) {
                    s.data.context[key] = dataSrc[key];
                });
            }
            return s;
        };

        p.activate = function () {
            var s = this;

            if (!s.data.method) {
                logc("MenuAction.activate: method is undefined!");
            }
            else if (typeof s.data.method != "function") {
                logc("MenuAction.activate: method is not a function!");
            }
            else {
                s.data.method(s.data.context);
            }
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
            return s;
        };

        return function (data) {
            return (new MenuAction()).setData(data);
        };
    }

    angular
        .module("rpActionsMenu")
        .factory("rpActionsMenuAction", [factory]);
})(angular);

//  Source: _lib\realpage\actions-menu\js\models\actions-menu.js
//  Actions Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(menuAction) {
        var id = 1;

        function ActionsMenuModel() {
            var s = this;
            s.init();
        }

        var p = ActionsMenuModel.prototype;

        p.init = function () {
            var s = this;

            s.id = id++;

            s.data = {
                actions: [],
                toggleText: "",
                menuOffsetTop: 20,
                menuOffsetLeft: 5,
                menuClassNames: "",
                toggleClassNames: "rp-icon-more"
            };

            s.panel = {
                show: false,
                position: {}
            };

            return s;
        };

        // Getters

        p.getOffsetLeft = function () {
            var s = this;
            return s.data.menuOffsetLeft;
        };

        p.getOffsetTop = function () {
            var s = this;
            return s.data.menuOffsetTop;
        };

        p.getToggleClassNames = function () {
            var s = this;
            return s.data.toggleClassNames;
        };

        p.getToggleText = function () {
            var s = this;
            return s.data.toggleText;
        };

        // Setters

        p.setActions = function (actions) {
            var s = this;
            s.actions = [];
            s.addActions(actions);
            return s;
        };

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            s.setActions(s.data.actions);
            return s;
        };

        p.setPanelPosition = function (position) {
            var s = this;
            angular.extend(s.panel.position, position);
            return s;
        };

        // Assertions

        p.panelIsVisible = function () {
            var s = this;
            return s.panel.show;
        };

        // Actions

        p.addActions = function (actions) {
            var s = this;
            s.fixActions(actions);
            actions.forEach(function (actionData) {
                s.actions.push(menuAction(actionData));
            });
            return s;
        };

        p.fixActions = function (actions) {
            actions.forEach(function (action) {
                if (action.data) {
                    action.context = action.data;
                    delete action.data;
                }
            });
        };

        p.forEachAction = function (callback) {
            var s = this;
            s.actions.forEach(callback);
            return s;
        };

        p.hidePanel = function () {
            var s = this;
            s.panel.show = false;
            return s;
        };

        p.togglePanel = function () {
            var s = this;
            s.panel.show = !s.panel.show;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.actions.forEach(function (action) {
                action.destroy();
            });
            s.actions = undefined;
            return s;
        };

        return function (data) {
            return (new ActionsMenuModel()).setData(data);
        };
    }

    angular
        .module("rpActionsMenu")
        .factory("rpActionsMenuModel", ["rpActionsMenuAction", factory]);
})(angular);


//  Source: _lib\realpage\actions-menu\js\templates\templates.inc.js
angular.module('app').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/actions-menu/templates/actions-menu-panel.html",
"<div ng-if=\"model.panel.show\" ng-style=\"model.panel.position\" ng-class=\"{open: model.panel.show}\" class=\"{{::model.data.menuClassNames}} rp-actions-menu-panel dropdown\"><ul class=\"rp-actions-menu-list dropdown-menu dropdown-menu-scale dropdown-menu-width\"><li ng-hide=\"action.data.disabled\" ng-repeat=\"action in model.actions\" class=\"rp-actions-menu-item {{::action.data.classNames}}\"><a ng-if=\"action.data.href\" href=\"{{::action.data.href}}\" class=\"rp-actions-menu-item-text {{::action.data.iconClassNames}}\">{{::action.data.text}} </a><span ng-if=\"!action.data.href\" ng-click=\"action.activate()\" class=\"rp-actions-menu-item-text {{::action.data.iconClassNames}}\">{{::action.data.text}}</span></li></ul></div>");
$templateCache.put("realpage/actions-menu/templates/actions-menu.html",
"<span ng-click=\"rpActionsMenu.togglePanel($event)\" class=\"rp-actions-menu {{::model.data.toggleClassNames}}\">{{::model.data.toggleText}}</span>");
}]);

