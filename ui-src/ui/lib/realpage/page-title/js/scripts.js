angular.module("rpPageTitle", []);

//  Source: _lib\realpage\page-title\js\providers\page-title.js
//  Resource Paths Provider

(function (angular) {
    "use strict";

    function Provider() {
        var prodName,
            prov = this,
            metaData = [],
            companyName = "OneSite";

        prov.setData = function (data) {
            metaData = data;
            return prov;
        };

        prov.setProdName = function (name) {
            prodName = name;
            return prov;
        };

        prov.setCompanyName = function (name) {
            companyName = name;
            return prov;
        };

        function provide($rootScope, location, eventStream) {
            var model = {};

            model.events = {};
            model.isReady = false;
            model.prodName = prodName;
            model.companyName = companyName;

            model.init = function () {
                model.events.update = eventStream();
                $rootScope.$on('$locationChangeSuccess', model.setDataModel);
                return model;
            };

            model.setDataModel = function () {
                var found = false,
                    url = location.url();

                metaData.forEach(function (listItem) {
                    if (url.match(listItem.url)) {
                        found = true;
                        var pageTitle = model.getPageTitle(listItem.data);
                        model.events.update.publish(pageTitle);
                    }
                });

                if (!found) {
                    model.events.update.publish("");
                }
            };

            model.getPageTitle = function (data) {
                var parts = [data.pageTitle, prodName, model.companyName];
                return parts.join(" - ");
            };

            model.subscribe = function (eventName, callback) {
                var valid = eventName && callback &&
                    typeof eventName == "string" &&
                    typeof callback == "function" &&
                    model.events[eventName] !== undefined;

                if (valid) {
                    model.events[eventName].subscribe(callback);
                }
                else {
                    logc("rpPageTitleModel-subscribe: Invalid input params!");
                }
            };

            return model.init();
        }

        prov.$get = ['$rootScope', 'location', 'eventStream', provide];
    }

    angular
        .module("rpPageTitle")
        .provider('rpPageTitleModel', [Provider]);
})(angular);

//  Source: _lib\realpage\page-title\js\directives\page-title.js
//  Page Title Directive

(function (angular) {
    "use strict";

    function title(model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                model.subscribe("update", dir.setPageTitle);
            };

            dir.setPageTitle = function (title) {
                elem.text(title);
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'E'
        };
    }

    angular
        .module("rpPageTitle")
        .directive('title', ['rpPageTitleModel', title]);
})(angular);
