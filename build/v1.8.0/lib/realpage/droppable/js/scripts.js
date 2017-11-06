//  Source: _lib\realpage\droppable\js\_bundle.inc
angular.module("rpDroppable", []);

//  Source: _lib\realpage\droppable\js\services\droppable.js
//  Droppable Service

(function (angular) {
    "use strict";

    function factory(pool) {
        var svc = pool();
        return svc;
    }

    angular
        .module("rpDroppable")
        .factory('rpDroppableSvc', ['rpPoolSvc', factory]);
})(angular);

//  Source: _lib\realpage\droppable\js\directives\droppable.js
//  Droppable Directive

(function (angular) {
    "use strict";

    function rpDroppable(svc, rectangle) {
        var index = 1;

        function link(scope, elem, attr) {
            var rect,
                dir = {},
                evns = '.drop' + index++,
                mouseenter = 'mouseenter' + evns;

            function init() {
                svc(attr.rpDroppable, dir);
            }

            dir.contains = function (point) {
                return rectangle().fromElement(elem).contains(point);
            };

            init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpDroppable")
        .directive('rpDroppable', ['rpDroppableSvc', 'rectangle', rpDroppable]);
})(angular);

