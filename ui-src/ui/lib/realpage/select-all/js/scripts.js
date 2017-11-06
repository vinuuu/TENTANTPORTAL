//  Source: _lib\realpage\select-all\js\models\select-all.js
//  Select All Model

(function (angular, undefined) {
    "use strict";

    function factory(timeout) {
        function SelectAllModel() {
            var s = this;
            s.init();
        }

        var p = SelectAllModel.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.active = true;
            s.selected = false;
            s.changeCallback = angular.noop;
        };

        // Setters

        p.setChangeCallback = function (callback) {
            var s = this;
            if (typeof callback == "function") {
                s.changeCallback = callback;
            }
            else {
                logc("SelectAllModel.setChangeCallback: Callback is not a function!", callback);
            }
            return s;
        };

        p.setList = function (list) {
            var s = this;

            s.list = list || [];

            s.list.forEach(function (item) {
                item.setChangeCallback(s.onChange.bind(s));
            });

            s.initStatus();

            return s;
        };

        p.setSelected = function (bool) {
            var s = this;

            s.list.forEach(function (item) {
                if (item.isActive()) {
                    item.setSelected(bool);
                }
            });

            s.selected = bool;

            return s;
        };

        // Actions

        p.initStatus = function () {
            var s = this,
                activeCount = 0,
                selectedCount = 0;

            s.list.forEach(function (item) {
                if (item.isActive()) {
                    activeCount++;

                    if (item.isSelected()) {
                        selectedCount++;
                    }
                }
            });

            s.active = activeCount !== 0;
            s.selected = (activeCount === selectedCount) && (selectedCount !== 0);

            return s;
        };

        p.onChange = function () {
            var s = this;
            timeout(s.updateStatus.bind(s));
            return s;
        };

        p.toggle = function () {
            var s = this,
                bool = !s.selected;

            s.list.forEach(function (item) {
                if (item.isActive()) {
                    item.setSelected(bool);
                }
            });

            s.selected = bool;
            s.changeCallback();

            return s;
        };

        p.updateStatus = function () {
            var s = this;
            s.initStatus().changeCallback();
            return s;
        };

        // Assertions

        p.isActive = function () {
            var s = this;
            return s.active;
        };

        p.isSelected = function () {
            var s = this;
            return s.selected;
        };

        // Destroy

        p.destroy = function () {
            var s = this;
            s.list = undefined;
            s.selected = undefined;
        };

        return function (list) {
            return (new SelectAllModel()).setList(list);
        };
    }

    angular
        .module("rpSelectAll")
        .factory("rpSelectAllModel", ["timeout", factory]);
})(angular);

//  Source: _lib\realpage\select-all\js\models\select-all-item.js
//  Select Item Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function SelectAllItemModel() {
            var s = this;
            s.init();
        }

        var p = SelectAllItemModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {
                obj: {},
                activeKey: "active",
                selectionKey: "selected"
            };
            s.changeCallback = angular.noop;
        };

        // Setters

        p.setChangeCallback = function (callback) {
            var s = this;
            s.changeCallback = callback;
            return s;
        };

        p.setData = function (data) {
            var s = this;
            s.data = data || {};
            return s;
        };

        p.setSelected = function (bool) {
            var s = this;
            s.data.obj[s.data.selectionKey] = bool;
            return s;
        };

        // Actions

        p.onChange = function () {
            var s = this;
            s.changeCallback();
            return s;
        };

        // Assertions

        p.isActive = function () {
            var s = this;
            return s.data.obj[s.data.activeKey];
        };

        p.isSelected = function () {
            var s = this;
            return s.data.obj[s.data.selectionKey];
        };

        // Destroy

        p.destroy = function () {
            var s = this;
            s.data = undefined;
            s.changeCallback = undefined;
        };

        return function (data) {
            return (new SelectAllItemModel()).setData(data);
        };
    }

    angular
        .module("rpSelectAll")
        .factory("rpSelectAllItemModel", [factory]);
})(angular);

//  Source: _lib\realpage\select-all\js\directives\select-all.js
//  Select All Directive

(function (angular, undefined) {
    "use strict";

    function rpSelectAll() {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                elem.on("click", dir.onClick);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onClick = function () {
                scope.$apply(function () {
                    scope.rpModel.toggle();
                });
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.off("click");

                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                rpModel: "=",
                rpLabelText: "=?"
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/select-all/templates/select-all.html"
        };
    }

    angular
        .module("rpSelectAll")
        .directive("rpSelectAll", [rpSelectAll]);
})(angular);

//  Source: _lib\realpage\select-all\js\templates\templates.inc.js
angular.module("app").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/select-all/templates/select-all.html",
"<div class=\"rp-select-all\" rp-stop-event=\"click\"><span class=\"rp-select-all-state\" ng-class=\"{'selected': rpModel.selected}\"></span> <span class=\"rp-select-all-label\">{{rpLabelText}}</span></div>");
}]);

