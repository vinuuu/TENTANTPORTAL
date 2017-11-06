//  Source: _lib\realpage\nav-tabs\js\_bundle.inc
angular.module("rpNavTabs", []);


//  Source: _lib\realpage\nav-tabs\js\templates\templates.inc.js
angular.module("rpNavTabs").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/nav-tabs/templates/nav-tabs.html",
"<div class=\"rp-nav-tabs {{::model.data.wrapperClass}}\"><ul class=\"rp-nav-tabs-list {{::model.data.listClass}}\"><li class=\"rp-nav-tab {{tab.className}}\" ng-repeat=\"tab in model.data.tabsList\"><a ng-if=\"tab.href\" rp-nav-tab-content href=\"{{tab.href}}\" ng-class=\"tab.state\" class=\"rp-nav-tab-text rp-nav-tab-link {{tab.textClassName}}\"><i ng-if=\"tab.iconClassName\" class=\"icon {{tab.iconClassName}}\"></i> {{tab.text}} </a><span ng-if=\"!tab.href\" rp-nav-tab-content ng-class=\"tab.state\" ng-click=\"model.callMethod(tab)\" class=\"rp-nav-tab-text {{tab.textClassName}}\"><i ng-if=\"tab.iconClassName\" class=\"icon {{tab.iconClassName}}\"></i> {{tab.text}}</span></li></ul></div>");
$templateCache.put("realpage/nav-tabs/templates/sample-tab.html",
"<span>Sample Tab - {{tab.text}}</span>");
}]);

//  Source: _lib\realpage\nav-tabs\js\models\nav-tabs.js
//  Nav Tabs Model

(function (angular) {
    "use strict";

    function factory(eventsManager) {
        return function () {
            var activeTab,
                model = {},
                eventsList = ["change"],
                events = eventsManager();

            model.events = events;
            events.setEvents(eventsList);

            model.data = {
                tabsList: []
            };

            model.setData = function (data) {
                model.data = data;
                return model;
            };

            model.activateTab = function (tabID) {
                model.data.tabsList.forEach(function (tab) {
                    tab.state.active = tab.id == tabID;
                });
                return model;
            };

            model.callMethod = function (tab) {
                if (tab.state.active) {
                    return;
                }

                activeTab = tab;

                if (typeof tab.method == "function") {
                    tab.method(tab);
                }

                model.activateTab(tab.id);
                events.publish("change", tab);
            };

            model.subscribe = function (eventName, callback) {
                events.subscribe(eventName, callback);
            };

            model.getActiveTab = function () {
                return activeTab;
            };

            model.destroy = function () {
                events.destroy();
                model = undefined;
                events = undefined;
            };

            return model;
        };
    }

    angular
        .module("rpNavTabs")
        .factory("rpNavTabsModel", ["eventsManager", factory]);
})(angular);

//  Source: _lib\realpage\nav-tabs\js\directives\nav-tab.js
//  Nav Tab Directive

(function (angular) {
    "use strict";

    function rpNavTabContent($compile, $templateCache) {
        function link(scope, elem, attr) {
            if (!scope.tab.templateUrl) {
                return;
            }

            var url = scope.tab.templateUrl,
                el = angular.element($templateCache.get(url));

            el = $compile(el)(scope);
            elem.html('').append(el);
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpNavTabs")
        .directive("rpNavTabContent", ["$compile", "$templateCache", rpNavTabContent]);
})(angular);

//  Source: _lib\realpage\nav-tabs\js\directives\nav-tabs.js
//  Nav Tabs Directive

(function (angular) {
    "use strict";

    function rpNavTabs() {
        function link(scope, elem, attr) {

        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/nav-tabs/templates/nav-tabs.html"
        };
    }

    angular
        .module("rpNavTabs")
        .directive("rpNavTabs", [rpNavTabs]);
})(angular);

