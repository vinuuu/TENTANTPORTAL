//  Source: _lib\realpage\tabs-menu\js\_bundle.inc
angular.module("rpTabsMenu", []);

//  Source: _lib\realpage\tabs-menu\js\templates\tabs-menu.js
//  Tabs Menu Template

(function(angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/tabs-menu/tabs-menu.html";

    templateHtml = "" +
        "<div class='rp-tabs-menu btn-group btn-group-rounded btn-group-outline b-primary rounded'>" +
        "<button ng-repeat='menuItem in model.list' ng-click='model.activate(menuItem)' ng-class='{active: menuItem.isActive}' type='button' class='btn white b-primary text-primary rounded btn-min-width'>" +
        "{{menuItem.text}}" +
        "</button>" +
        "</div>";


    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpTabsMenu")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\tabs-menu\js\models\tabs-menu.js
//  Tabs Menu Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        return function () {
            var model = {};

            model.list = [];

            model.events = {
                change: eventStream()
            };

            model.setOptions = function (options) {
                if (options && options.forEach) {
                    options.forEach(model.addOption);
                }
                return model;
            };

            model.addOption = function (option) {
               // option.isActive = model.list.length === 0;
                model.list.push(option);
                if (option.isActive) {
                    model.selected = option;
                }
                return model;
            };

            model.activate = function (option) {
                if (option.isActive) {
                    return;
                }
                model.list.forEach(function (listItem) {
                    listItem.isActive = listItem.text == option.text;
                });
                model.selected = option;
                model.events.change.publish(option);
                return model;
            };

            model.subscribe = function (eventName, callback) {
                if (typeof callback != "function") {
                    logc("TabsMenu.subscribe: callback is not a function! =>", callback);
                }
                else if (!model.events[eventName]) {
                    logc("TabsMenu.subscribe: " + eventName + " is not a valid event name!");
                }
                else {
                    return model.events[eventName].subscribe(callback);
                }
            };

            model.destroy = function () {
                model.events.change.destroy();
                model.events = undefined;
                model = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpTabsMenu")
        .factory("rpTabsMenuModel", ["eventStream", factory]);
})(angular);

//  Source: _lib\realpage\tabs-menu\js\directives\tabs-menu.js
//  Tabs Menu Directive

(function (angular) {
    "use strict";

    function rpTabsMenu() {
        function link(scope, elem, attr) {
            if (!scope.model) {
                elem.remove();
                logc('rpTabsMenu: model is undefined!');
            }
        }

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/tabs-menu/tabs-menu.html"
        };
    }

    angular
        .module("rpTabsMenu")
        .directive('rpTabsMenu', [rpTabsMenu]);
})(angular);

