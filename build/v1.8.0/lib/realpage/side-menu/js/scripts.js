//  Source: _lib\realpage\side-menu\js\directives\side-menu.js
//  Side Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpSideMenu() {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                scope.sideMenu = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.setActive = function (newItem) {
                var item = model.getActiveItem();

                if (model.isValid(item)) {
                    model.setActive(newItem);
                }
            };

            dir.invokeLink = function (newItem) {
                var item = model.getActiveItem();

                if (model.isValid(item)) {
                    model.invokeLink(newItem);
                }
            };

            dir.invokeState = function (newItem) {
                var item = model.getActiveItem();

                if (model.isValid(item)) {
                    model.invokeState(newItem);
                }
            };

            dir.invokeMethod = function (newItem) {
                var item = model.getActiveItem();

                if (model.isValid(item)) {
                    dir.setActive(newItem);
                    newItem.method(newItem.args);
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                delete scope.sideMenu;

                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
                scope = undefined;
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
            templateUrl: "realpage/side-menu/templates/side-menu.html"
        };
    }

    angular
        .module("rpSideMenu")
        .directive("rpSideMenu", [rpSideMenu]);
})(angular);

//  Source: _lib\realpage\side-menu\js\models\side-menu.js
//  Side Menu Model

(function (angular, undefined) {
    "use strict";

    function factory($state, $window, eventsManager, methodsRepo) {
        var index = 1;

        function SideMenuModel() {
            var s = this;
            s.init();
        }

        var p = SideMenuModel.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.repo = methodsRepo();
            s.events = eventsManager();
            s.events.setEvents(["change"]);
        };

        // Getters

        p.getActiveItem = function () {
            var s = this,
                activeItem,
                found = false;

            s.list.forEach(function (item) {
                if (item.active && !found) {
                    found = true;
                    activeItem = item;
                }
            });

            return activeItem;
        };

        p.getMethod = function (methodName) {
            var s = this;
            return s.repo.get(methodName);
        };

        // Setters

        p.setActive = function (menuItem) {
            var s = this;

            s.list.forEach(function (item) {
                item.active = item._id == menuItem._id;
            });

            s.events.publish("change", menuItem);

            return s;
        };

        p.setList = function (list) {
            var s = this;
            s.list = list || [];

            s.list.forEach(function (item) {
                item._id = index++;
            });

            return s;
        };

        p.setSrc = function (src) {
            var s = this;
            s.repo.setSrc(src);
            return s;
        };

        // Actions

        p.invokeLink = function (newItem) {
            var s = this;
            $window.location.href = newItem.href;
            return s;
        };

        p.invokeState = function (newItem) {
            var s = this;
            $state.go(newItem.sref, newItem.stateParams || {});
            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        // Assertions

        p.isValid = function (item) {
            var s = this,
                isValid = true;

            if (item.validators) {
                angular.forEach(item.validators, function (val) {
                    if (isValid) {
                        isValid = isValid && val(item);
                    }
                });
            }

            return isValid;
        };

        p.destroy = function () {
            var s = this;
            s.list.flush();
            s.repo.destroy();

            s.list = undefined;
            s.repo = undefined;
        };

        return function (list) {
            return (new SideMenuModel()).setList(list);
        };
    }

    angular
        .module("rpSideMenu")
        .factory("rpSideMenuModel", [
            "$state",
            "$window",
            "eventsManager",
            "rpMethodsRepo",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\side-menu\js\templates\templates.inc.js
angular.module("rpSideMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/side-menu/templates/side-menu.html",
"<div class=\"rp-side-menu-wrap\"><ul class=\"rp-side-menu\"><li class=\"rp-side-menu-item\" ng-repeat=\"menuItem in model.list\"><a ng-if=\"menuItem.sref\" class=\"rp-side-menu-item-text\" ng-click=\"sideMenu.invokeState(menuItem)\">{{menuItem.text}} </a><span ng-if=\"menuItem.href\" class=\"rp-side-menu-item-text\" ng-class=\"{active: menuItem.active}\" ng-click=\"sideMenu.invokeLink(menuItem)\">{{menuItem.text}} </span><span ng-if=\"menuItem.method\" class=\"rp-side-menu-item-text\" ng-class=\"{active: menuItem.active}\" ng-click=\"sideMenu.invokeMethod(menuItem)\">{{menuItem.text}} </span><span ng-if=\"!menuItem.sref && !menuItem.href && !menuItem.method\" class=\"rp-side-menu-item-text\" ng-class=\"{active: menuItem.active}\" ng-click=\"sideMenu.setActive(menuItem)\">{{menuItem.text}}</span></li></ul></div>");
}]);

