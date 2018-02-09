//  Source: _lib\realpage\grid-controls\js\models\grid-select.js
//  Grid Select Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        return function () {
            var model = {};

            model.selected = false;

            model.setEvents = function (events) {
                model.events = events;
                return model;
            };

            model.publishState = function () {
                model.events.publish("select", model.selected);
                return model;
            };

            model.updateSelected = function (bool) {
                model.selected = bool;
            };

            model.destroy = function () {
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridSelectModel", [factory]);
})(angular);

//  Source: _lib\realpage\grid-controls\js\directives\grid-select.js
//  Grid Select All Directive

(function (angular, undefined) {
    "use strict";

    function rpGridSelect(gridSelectModel) {
        function link(scope, elem, attr) {
            var dir = {},
                model = gridSelectModel(),
                grid = scope.$eval(attr.rpGridModel);

            dir.init = function () {
                dir.model = model;
                scope.gridSelect = dir;
                grid.setGridSelectModel(model);
                model.setEvents(grid.getEvents());
                scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                model.destroy();
                dir = undefined;
                grid = undefined;
                model = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridSelect", ["rpGridSelectModel", rpGridSelect]);
})(angular);
