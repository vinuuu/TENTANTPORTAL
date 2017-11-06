//  Source: _lib\realpage\scroll-page\js\_bundle.inc
angular.module("rpScrollPage", []);

//  Source: _lib\realpage\scroll-page\js\models\scroll-page.js
//  Scroll Page Model

(function (angular) {
    "use strict";

    function factory(eventsManager) {
        return function () {
            var model = {};

            model.events = eventsManager();

            model.events.setEvents(['scrollTop', 'scrollLeft']);

            model.publish = function () {
                var fn = model.events.publish;
                fn.apply(fn, arguments);
            };

            model.subscribe = function () {
                var fn = model.events.subscribe;
                fn.apply(fn, arguments);
            };

            return model;
        };
    }

    angular
        .module("rpScrollPage")
        .factory('rpScrollPageModel', ['eventsManager', factory]);
})(angular);

//  Source: _lib\realpage\scroll-page\js\directives\scroll-page.js
//  Scroll Page Directive

(function (angular) {
    "use strict";

    function rpScrollPage() {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                var model = dir.getModel();
                dir.page = angular.element('html, body');
                model.subscribe('scrollTop', dir.scrollTop);
                model.subscribe('scrollLeft', dir.scrollLeft);
            };

            dir.getModel = function () {
                return scope.$eval(attr.rpScrollPage);
            };

            dir.scrollTop = function (top) {
                dir.page.prop('scrollTop', top);
            };

            dir.scrollLeft = function (left) {
                dir.page.prop('scrollLeft', left);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpScrollPage")
        .directive('rpScrollPage', [rpScrollPage]);
})(angular);

