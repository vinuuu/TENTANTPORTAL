//  Source: _lib\realpage\accordion-menu\js\directives\accordion-menu.js
//  Accordion Menu Directive

(function (angular, undefined) {
    "use strict";

    function rpAccordionMenu() {
        var index = 1;

        function link(scope, elem, attr) {
            var dir = {
                links: []
            };

            dir.init = function () {
                dir.genLinksList();
                scope.acMenu = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.genLinksList = function (list) {
                (list || scope.model.list).forEach(function (item) {
                    if (item.list && item.list.length > 0) {
                        dir.genLinksList(item.list);
                    }
                    else {
                        item.id = index++;
                        dir.links.push(item);
                    }
                });

                return dir;
            };

            dir.invokeMethod = function (item) {
                item.method(item);
                dir.setActive(item);
            };

            // Assertions

            dir.hasSubmenu = function (data) {
                return data.list && data.list.length > 0;
            };

            dir.setActive = function (item) {
                dir.links.forEach(function (link) {
                    link.active = link.id == item.id;
                });
            };

            dir.destroy = function () {
                dir.destWatch();
                delete scope.acMenu;

                dir = undefined;
                attr = undefined;
                elem = undefined;
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
            templateUrl: "realpage/accordion-menu/templates/accordion-menu.html"
        };
    }

    angular
        .module("rpAccordionMenu")
        .directive("rpAccordionMenu", [rpAccordionMenu]);
})(angular);

//  Source: _lib\realpage\accordion-menu\js\directives\accordion-menu-toggle.js
//  Accordion Menu Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpAccordionMenuToggle($timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                click = "click.rpAccordionMenuToggle";

            dir.init = function () {
                scope.acMenuToggle = dir;
                elem.on(click, dir.onClick);
                $timeout(dir.initState, 100);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.initState = function () {
                dir.menu = elem.siblings();

                dir.state = {
                    active: elem.hasClass("open")
                };

                if (!dir.state.active) {
                    dir.menu.height(0);
                }
            };

            dir.onClick = function () {
                scope.$apply(dir.toggleMenu);
            };

            dir.toggleMenu = function () {
                var active = dir.state.active;
                dir[active ? "closeMenu" : "openMenu"]();
            };

            dir.openMenu = function () {
                var ht = dir.menu[0].scrollHeight;
                dir.animMenu(ht);
                dir.state.active = true;
            };

            dir.closeMenu = function () {
                dir.animMenu(0);
                dir.state.active = false;
            };

            dir.animMenu = function (ht) {
                dir.menu.animate({
                    height: ht
                }, 300);
            };

            dir.destroy = function () {
                elem.off(click);
                dir.destWatch();
                delete scope.acMenuToggle;

                dir = undefined;
                attr = undefined;
                elem = undefined;
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
        .module("rpAccordionMenu")
        .directive("rpAccordionMenuToggle", [
            "$timeout",
            rpAccordionMenuToggle
        ]);
})(angular);

//  Source: _lib\realpage\accordion-menu\js\templates\templates.inc.js
angular.module("rpAccordionMenu").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/accordion-menu/templates/accordion-menu.html",
"<ul class=\"rp-accordion\"><li class=\"rp-accordion-level1\" ng-repeat=\"level1MenuItem in model.list\"><span rp-accordion-menu-toggle ng-class=\"acMenuToggle.state\" class=\"rp-accordion-level1-label\">{{level1MenuItem.text}}</span><ul class=\"rp-accordion-level1-menu\" ng-if=\"acMenu.hasSubmenu(level1MenuItem)\"><li class=\"rp-accordion-level2\" ng-repeat=\"level2MenuItem in level1MenuItem.list\"><a ng-if=\"level2MenuItem.sref\" ui-sref-active=\"active\" class=\"rp-accordion-level2-label\" ui-sref=\"{{level2MenuItem.sref}}\" ng-click=\"acMenu.setActive(level2MenuItem)\" ng-class=\"{active: level2MenuItem.active}\">{{level2MenuItem.text}} </a><a ng-if=\"level2MenuItem.href\" class=\"rp-accordion-level2-label\" ng-href=\"{{level2MenuItem.sref}}\" ng-click=\"acMenu.setActive(level2MenuItem)\" ng-class=\"{active: level2MenuItem.active}\">{{level2MenuItem.text}} </a><span ng-if=\"level2MenuItem.method\" class=\"rp-accordion-level2-label\" ng-class=\"{active: level2MenuItem.active}\" ng-click=\"acMenu.invokeMethod(level2MenuItem)\">{{level2MenuItem.text}}</span></li></ul></li></ul>");
}]);
