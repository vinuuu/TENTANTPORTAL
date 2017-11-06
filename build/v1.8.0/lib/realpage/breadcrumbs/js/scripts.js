//  Source: _lib\realpage\breadcrumbs\js\_bundle.inc
angular.module("rpBreadcrumbs", []);

//  Source: _lib\realpage\breadcrumbs\js\templates\templates.inc.js
angular.module("rpBreadcrumbs").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/breadcrumbs/templates/breadcrumbs.html",
"<div class=\"rp-breadcrumbs\" ng-show=\"model.isVisible\"><a class=\"home-icon {{model.home.icon}}\" href=\"{{model.home.url}}\"></a><div class=\"pull-left ft-b-r\"><div class=\"product-name\">{{model.product.name}}</div><div class=\"rp-breadcrumbs-links\" ng-if=\"!model.showBackBtn\"><div class=\"rp-breadcrumb home-link\"><a href=\"{{model.home.url}}\" class=\"rp-breadcrumb-text\">{{model.home.text}}</a></div><ul class=\"rp-breadcrumbs-list\"><li ng-repeat=\"link in model.links\" class=\"rp-breadcrumb p-a-0\"><a href=\"{{link.href}}\" class=\"rp-breadcrumb-text\">{{link.text}}</a></li></ul><div class=\"active-page rp-breadcrumb\"><span class=\"active-page-text rp-breadcrumb-text\">{{model.activePage.text}}</span></div></div><div class=\"rp-breadcrumb home-link\" ng-if=\"model.showBackBtn\"><span class=\"rp-breadcrumb-back-text\" ng-click=\"model.goBack()\">{{model.backLinkData.text}}</span></div></div></div>");
}]);

//  Source: _lib\realpage\breadcrumbs\js\providers\breadcrumbs.js
//  Breadcrumbs Model Provider

(function (angular) {
    "use strict";

    function Provider() {
        var prov = this;

        prov.links = {};
        prov.breadcrumbs = [];

        prov.setProduct = function (product) {
            prov.product = product;
            return prov;
        };

        prov.setHome = function (home) {
            prov.home = home;
            return prov;
        };

        prov.setLinks = function (links) {
            prov.links = links;
            return prov;
        };

        prov.setBreadcrumbs = function (breadcrumbs) {
            prov.breadcrumbs = breadcrumbs;
            return prov;
        };

        function provide($rootScope, $window, location, storage) {
            var model = {},
                ev = "$locationChangeSuccess";

            model.init = function () {
                model.backLinkData = {
                    text: "Back"
                };
                model.updateFromStorage();
                $rootScope.$on(ev, model.setLinks);
                model.home = angular.extend({}, prov.home);
                model.product = angular.extend({}, prov.product);
                return model;
            };

            model.updateFromStorage = function () {
                var dataKey = "breadcrumbsLinks";

                if (storage.has(dataKey)) {
                    var links = storage.get(dataKey);
                    Object.keys(links).forEach(function (key) {
                        angular.extend(prov.links[key], links[key]);
                    });
                }
            };

            model.setLinks = function () {
                var url = location.url();

                model.isVisible = false;
                model.showBackLink(false).restoreBackLink();

                prov.breadcrumbs.forEach(function (item) {
                    if (url.match(item.url)) {
                        model.isVisible = true;
                        model.links = item.links || [];
                        model.activePage = item.activePage;
                        model.home.icon = item.homeIcon || prov.home.icon;
                        model.product.name = item.productName || prov.product.name;
                    }
                });

                model.updateLinks();
            };

            model.setActivePage = function (page) {
                model.activePage = page;
                return model;
            };

            model.updateLinks = function () {
                var updated = false,
                    url = location.url();

                Object.keys(prov.links).forEach(function (key) {
                    var link = prov.links[key],
                        regex = link.pattern ? new RegExp(link.pattern) : "";

                    if (link.pattern !== undefined && url.match(regex)) {
                        updated = true;
                        link.href = url;
                    }
                });

                if (updated) {
                    storage.set("breadcrumbsLinks", prov.links);
                }

                return model;
            };

            model.showBackLink = function (bool) {
                bool = bool === undefined ? true : !!bool;
                model.showBackBtn = bool;
                return model;
            };

            model.updateBackLink = function (data) {
                data = data || {};
                angular.extend(model.backLinkData, data);
                return model;
            };

            model.restoreBackLink = function () {
                angular.extend(model.backLinkData, {
                    url: "",
                    text: "Back"
                });
                return model;
            };

            model.goBack = function () {
                if (model.backLinkData.url) {
                    location.url(model.backLinkData.url); // url = "/roles/23"
                }
                else {
                    $window.history.back();
                }

                return model;
            };

            return model.init();
        }

        prov.$get = [
            "$rootScope",
            "$window",
            "location",
            "rpSessionStorage",
            provide
        ];
    }

    angular
        .module("rpBreadcrumbs")
        .provider("rpBreadcrumbsModel", [Provider]);
})(angular);

//  Source: _lib\realpage\breadcrumbs\js\directives\breadcrumbs.js
//  Breadcrumbs Directive

(function (angular) {
    "use strict";

    function rpBreadcrumbs(model) {
        function link(scope, elem, attr) {
            scope.model = model;
        }

        return {
            scope: {},
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/breadcrumbs/templates/breadcrumbs.html"
        };
    }

    angular
        .module("rpBreadcrumbs")
        .directive('rpBreadcrumbs', ["rpBreadcrumbsModel", rpBreadcrumbs]);
})(angular);

