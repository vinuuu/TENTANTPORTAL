//  Source: _lib\realpage\accordion\js\_bundle.inc
angular.module("rpAccordion", []);

//  Source: _lib\realpage\accordion\js\directives\accordion.js
//  Accordion Directive

(function (angular) {
    "use strict";

    function rpAccordion(watchable) {
        function link(scope, elem, attr) {
            var model;

            function closeInactiveMenu(activeMenu) {
                model.forEach(function (menu) {
                    if (menu.title !== activeMenu.title) {
                        menu.accordionMenu.isOpen.set(false);
                    }
                });
            }

            function init() {
                model = scope.$eval(attr.rpAccordion);

                model.forEach(function (menu) {
                    var isOpen = watchable(false);

                    menu.accordionMenu = {
                        isOpen: isOpen
                    };

                    isOpen.watch(function (isOpen) {
                        if (isOpen === true) {
                            closeInactiveMenu(menu);
                        }
                    });
                });
            }

            init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpAccordion")
        .directive('rpAccordion', ['watchable', rpAccordion]);
})(angular);

//  Source: _lib\realpage\accordion\js\directives\accordion-menu.js
//  Accordion Menu Directive

(function (angular) {
    "use strict";

    function rpAccordionMenu(timeout) {
        function link(scope, elem, attr) {
            var model;

            function animate(isOpen) {
                elem.animate({
                    height: isOpen ? model.openHeight : model.closedHeight
                }, 200);
            }

            function init() {
                model = scope.$eval(attr.rpAccordionMenu);

                model.isOpen.watch(animate);

                timeout(function () {
                    model.openHeight = elem.outerHeight();
                    elem.height(model.closedHeight);
                });
            }

            init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpAccordion")
        .directive('rpAccordionMenu', ['timeout', rpAccordionMenu]);
})(angular);

//  Source: _lib\realpage\accordion\js\directives\accordion-menu-title.js
//  Accordion Menu Title Directive

(function (angular) {
    "use strict";

    function rpAccordionMenuTitle(timeout) {
        function link(scope, elem, attr) {
            var model, isBusy;

            function toggle() {
                if (isBusy) {
                    return;
                }

                isBusy = true;

                var isOpen = !model.isOpen.get();
                model.isOpen.set(isOpen);

                timeout(function () {
                    isBusy = false;
                }, 200);
            }

            function init() {
                model = scope.$eval(attr.rpAccordionMenuTitle);

                timeout(function () {
                    model.closedHeight = elem.outerHeight();
                });

                elem.on('click.rpAccordionMenuTitle', toggle);
            }


            init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpAccordion")
        .directive('rpAccordionMenuTitle', ['timeout', rpAccordionMenuTitle]);
})(angular);

