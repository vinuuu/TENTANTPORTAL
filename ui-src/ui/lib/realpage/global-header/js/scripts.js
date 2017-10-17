angular.module("rpGlobalHeader", []);

//  Source: _lib\realpage\global-header\js\controllers\app-switcher.js
//  App Switcher Controller

(function (angular, undefined) {
    "use strict";

    function AppSwitcherCtrl($scope, tabsMenuData, tabsMenuModel) {
        var vm = this,
            model = $scope.model,
            tabsList = tabsMenuData.getTabsList();

        vm.init = function () {
            $scope.tabsData = tabsMenuData.getData();
            $scope.tabsMenu = tabsMenuModel(tabsList);
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
            tabsList = undefined;
        };

        vm.init();
    }

    angular
        .module("rpGlobalHeader")
        .controller("AppSwitcherCtrl", [
            "$scope",
            "rpGhAppSwitcherTabsData",
            "rpScrollingTabsMenuModel",
            AppSwitcherCtrl
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\controllers\global-header.js
//  Global Header Controller

(function (angular, undefined) {
    "use strict";

    function RpGlobalHeaderCtrl($scope, model) {
        var vm = this;

        vm.init = function () {
            $scope.model = model;
            vm.destWatch = $scope.$on("$destroy", vm.destroy);
        };

        vm.destroy = function () {
            vm.destWatch();
            vm = undefined;
            $scope = undefined;
        };

        vm.init();
    }

    angular
        .module("rpGlobalHeader")
        .controller("rpGlobalHeaderCtrl", [
            "$scope",
            "rpGlobalHeaderModel",
            RpGlobalHeaderCtrl
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\directives\app-switcher-menu.js
//  Global Header App Switcher Directive

(function (angular) {
    "use strict";

    function rpGhAppSwitcherMenu() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            controller: "AppSwitcherCtrl as appSwitcher",
            templateUrl: "realpage/global-header/templates/app-switcher-menu.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhAppSwitcherMenu", [rpGhAppSwitcherMenu]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\global-header.js
// Global Header Directive

(function (angular, undefined) {
    "use strict";

    function globalHeader(model) {
        function link(scope, elem, attr) {}

        return {
            link: link,
            restrict: "E",
            replace: true,
            controller: "rpGlobalHeaderCtrl as header",
            templateUrl: "realpage/global-header/templates/header.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGlobalHeader", [
            "rpGlobalHeaderModel",
            globalHeader
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\filters\icon-path.js
// Global Header Icon Filter

(function (angular) {
    "use strict";

    function filter(cdnVer) {
        var icons = {
            "82F7C646-599D-4AA5-A4D1-D951CCE21280": "building-1",
            "0C9DA909-71FA-4807-BA36-7CCDE6E580EC": "building-2",
            "0c9da909-71fa-4807-ba36-7ccde6e580ec": "cart-1",
            "F80209A2-EFF4-4DBF-8A3D-785BCDF031A3": "cart-1",
            "07B352BA-1001-41FB-99CD-DBA778C70914": "user-hierarchy",
            "7E298848-4A6D-4042-BE9C-29FF2A73186C": "calculator-1",
            "C9D127AA-E694-4394-8D6D-AADB2A37B50B": "user-1",
            "2F29D8F5-3E6F-428A-A89C-D808C2ADFC86": "credit-card-1",
            "6BA23040-6B36-402A-86D9-60C3594A5712": "house-2",
            "514469EE-C813-483B-9A3A-C778209BC0A1": "user-with-phone",
            "A6239C5A-8B0F-415E-BD7F-83D48C47388E": "bulb-1",
            "EED3BAF4-46B3-48AC-A576-43659B233BA1": "scroll-with-house",
            "D174779E-9DD6-4D7D-A57F-21B3FAEF611F": "webpage-1",
            "A3EB1EAF-D7A8-41DA-9CF1-596B188BA616": "magnifying-glass-1",
            "0AE2B7C9-6492-4F8F-BC1B-6C0B1D8663C1": "scroll-with-house",
            "D2E30084-1F8F-46D2-A7F2-B668C423E61E": "user-with-headset",
            "702AFBCB-0BDB-4360-B120-C852FB593512": "card-with-dots-1",
            "CCFE2F2B-BE0B-4075-B673-110F683E51C4": "bar-chart-1",
            "1B6A6DDF-4476-4C02-93D1-A7CEB345F39A": "pie-chart-1",
            "955F9930-0753-43A1-9304-EAEC9F4B5626": "folder-1",
            "696E482C-D4BA-4ECB-ADF1-7E7A7C6D606D": "line-chart-1",
            "EA018F00-F2CE-41BF-8E87-38C84F4B40F4": "pie-chart-1",
            "EA66353F-338E-444E-8775-06FDC6B4D020": "briefcase-1"
        };

        return function (guid) {
            guid = guid.toUpperCase();

            if (!icons[guid]) {
                logc("Icon for guid " + guid + " is undefined!");
                return "";
            }

            return "/" + cdnVer + "/lib/realpage/svg-icons/images/" + icons[guid] + ".svg";
        };
    }

    angular
        .module("rpGlobalHeader")
        .filter("rpGhIconPath", ["cdnVer", filter]);
})(angular);

//  Source: _lib\realpage\global-header\js\filters\lang.js
// Global Header Language Filter

(function (angular) {
    "use strict";

    function filter(appLangTranslate) {
        return function (key, ready) {
            return ready !== false ? appLangTranslate("rpGlobalHeader").translate(key) : "";
        };
    }

    angular
        .module("rpGlobalHeader")
        .filter("rpGhLang", ["appLangTranslate", filter]);
})(angular);


//  Source: _lib\realpage\global-header\js\models\app-switcher-product.js
//  App Switcher Product Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function RpGhAppSwitcherProductModel() {
            var s = this;
            s.init();
        }

        var p = RpGhAppSwitcherProductModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data || s.data;
            return s;
        };

        // Actions

        p.translate = function () {
            var s = this,
                langkey = s.data.titleIDGuid;
            s.data.title = $filter("rpGhLang")(langkey + "-title");
            return s;
        };

        // Assertions

        p.isFavorite = function () {
            var s = this;
            return s.data.isFavorite;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new RpGhAppSwitcherProductModel()).setData(data);
        };
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhAppSwitcherProductModel", ["$filter", factory]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\app-switcher-service.js
//  App Switcher Service Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, productModel) {
        function RpGhAppSwitcherServiceModel() {
            var s = this;
            s.init();
        }

        var p = RpGhAppSwitcherServiceModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            s.products = [];
        };

        // Setters

        p.setData = function (data) {
            var s = this;

            s.data = data || s.data;

            s.products = [];

            data.subdomains.forEach(function (productData) {
                s.products.push(productModel(productData));
            });

            return s;
        };

        // Getters

        p.getProducts = function () {
            var s = this;
            return s.products;
        };

        p.getFavoritesCount = function () {
            var s = this,
                count = 0;

            s.products.forEach(function (product) {
                count += product.isFavorite() ? 1 : 0;
            });

            return count;
        };

        // Actions

        p.translate = function () {
            var s = this,
                langKey = s.data.titleIDGuid;

            s.data.title = $filter("rpGhLang")(langKey + "-title");

            s.products.forEach(function (product) {
                product.translate();
            });

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
            s.products = undefined;
        };

        return function (data) {
            return (new RpGhAppSwitcherServiceModel()).setData(data);
        };
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhAppSwitcherServiceModel", [
            "$filter",
            "rpGhAppSwitcherProductModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\app-switcher-tabs-data.js
//  Global Header App Switcher Tabs Data

(function (angular) {
    "use strict";

    function AppSwitcherTabsData($filter) {
        var data,
            svc = this;

        data = {
            services: {
                id: "01",
                isActive: false
            },

            favorites: {
                id: "02",
                isActive: true
            }
        };

        svc.translate = function () {
            data.services.text = $filter("rpGhLang")("all");
            data.favorites.text = $filter("rpGhLang")("favorites");
        };

        // Getters

        svc.getData = function () {
            return data;
        };

        svc.getTabsList = function () {
            return [
                data.services,
                data.favorites
            ];
        };

        // Actions

        svc.activateTab = function (tabKey) {
            angular.forEach(data, function (val, key) {
                val.isActive = key == tabKey;
            });
        };
    }

    angular
        .module("rpGlobalHeader")
        .service("rpGhAppSwitcherTabsData", [
            "$filter",
            AppSwitcherTabsData
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\app-switcher.js
//  App Switcher Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, serviceModel, tabsData) {
        function RpGhAppSwitcherModel() {
            var s = this;
            s.init();
        }

        var p = RpGhAppSwitcherModel.prototype;

        p.init = function () {
            var s = this;
            s.services = [];
            s.allProducts = [];
            s.manageLinkText = "";
            s.manageLinkID = "manage";
        };

        // Setters

        p.setData = function (data) {
            var s = this,
                favCount = 0;

            s.services = [];
            s.allProducts = [];

            if (data && data.records) {
                data.records.forEach(function (serviceData) {
                    var service = serviceModel(serviceData),
                        products = service.getProducts();

                    s.services.push(service);
                    favCount += service.getFavoritesCount();
                    s.allProducts = s.allProducts.concat(products);
                });

                s.translate();

                tabsData.activateTab(favCount === 0 ? "services" : "favorites");
            }

            return s;
        };

        // Actions

        p.translate = function () {
            var s = this;
            tabsData.translate();
            s.services.forEach(s.translateService.bind(s));
            s.manageLinkText = $filter("rpGhLang")(s.manageLinkID);
            return s;
        };

        p.translateService = function (service) {
            service.translate();
        };

        p.destroyService = function (service) {
            service.destroy();
        };

        p.destroy = function () {
            var s = this;
            s.services.forEach(s.destroyService.bind(s));
            return s;
        };

        return function (data) {
            return (new RpGhAppSwitcherModel()).setData(data);
        };
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhAppSwitcherModel", [
            "$filter",
            "rpGhAppSwitcherServiceModel",
            "rpGhAppSwitcherTabsData",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\global-header.js
//  Global Header Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, appSwitcherModel, userLinksModel) {
        function GlobalHeaderModel() {
            var s = this;
            s.init();
        }

        var p = GlobalHeaderModel.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                id: "ghData",

                logoLink: "",
                logoImgSrc: "",

                productLink: "",
                productName: "",
                productNameID: "my-realpage",

                userAvatar: ""
            };

            s.userLinks = userLinksModel();
            s.appSwitcher = appSwitcherModel();
        };

        // Setters

        p.setAppSwitcherData = function (data) {
            var s = this;
            s.appSwitcher.setData(data);
            return s;
        };

        p.setUserLinks = function (data) {
            var s = this;
            s.userLinks.setData(data);
            return s;
        };

        p.setDisabled = function () {
            var s = this;

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        // Actions

        p.extendData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        p.translate = function () {
            var s = this;
            s.appSwitcher.translate();
            s.data.productName = $filter("rpGhLang")(s.data.productNameID);
            return s;
        };

        return new GlobalHeaderModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGlobalHeaderModel", [
            "$filter",
            "rpGhAppSwitcherModel",
            "rpGhUserLinksModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\user-link.js
//  User Link Model

(function (angular, undefined) {
    "use strict";

    function factory($window, pubsub) {
        function UserLinkModel() {
            var s = this;
            s.init();
        }

        var p = UserLinkModel.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        p.setData = function (data) {
            var s = this;
            s.data = data || s.data;
            return s;
        };

        p.activate = function () {
            var s = this,
                method = "activate" + s.data.type.ucfirst();

            if (s[method]) {
                s[method](s.data);
            }
            else {
                logc("RpGhUserLink: Invalid link type! => ", s.data);
            }

            return s;
        };

        p.activateLink = function (data) {
            var s = this;
            if (data.newWindow) {
                $window.open(data.url, "_blank");
            }
            else {
                $window.location.href = data.url;
            }
            return s;
        };

        p.activateEvent = function (data) {
            var s = this;
            pubsub.publish(data.eventName + ".rpGlobalHeader");
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new UserLinkModel()).setData(data);
        };
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhUserLinkModel", ["$window", "pubsub", factory]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\user-links.js
//  User Links Model

(function (angular, undefined) {
    "use strict";

    function factory(userLinkModel) {
        function UserLinksModel() {
            var s = this;
            s.init();
        }

        var p = UserLinksModel.prototype;

        p.init = function () {
            var s = this;
            s.links = [];
        };

        p.setData = function (links) {
            var s = this;

            s.links = [];

            if (links) {
                links.forEach(function (linkData) {
                    s.links.push(userLinkModel(linkData));
                });
            }

            return s;
        };

        p.destroy = function () {
            var s = this;

            s.links.forEach(function (link) {
                link.destroy();
            });

            s.links.flush();
        };

        return function (data) {
            return (new UserLinksModel()).setData(data);
        };
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhUserLinksModel", ["rpGhUserLinkModel", factory]);
})(angular);


//  Source: _lib\realpage\global-header\js\templates\templates.inc.js
angular.module('app').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/global-header/templates/app-switcher-menu.html",
"<div class=\"rp-gh-app-switcher-menu\"><div rp-stop-event=\"click\" class=\"rp-gh-app-switcher-menu-tabs\"><rp-scrolling-tabs-menu model=\"tabsMenu\"></rp-scrolling-tabs-menu></div><div class=\"rp-gh-app-switcher-menu-content\"><div ng-show=\"tabsData.services.isActive\" class=\"rp-gh-app-switcher-services\"><div class=\"rp-gh-app-switcher-service\" ng-repeat=\"service in model.services\"><div class=\"rp-gh-app-switcher-service-title\"><span svg-src=\"{{service.data.titleIDGuid | rpGhIconPath}}\" class=\"rp-gh-app-switcher-service-icon rp-svg-icon\"></span> {{service.data.title}}</div><a class=\"rp-gh-app-switcher-product\" ng-href=\"{{product.data.productUrl}}\" ng-repeat=\"product in service.products\"><span svg-src=\"{{product.data.titleIDGuid | rpGhIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"product.data.title | htmlUnsafe\"></span></span></a></div></div><div ng-show=\"tabsData.favorites.isActive\" class=\"rp-gh-app-switcher-favorites\"><a ng-if=\"product.isFavorite()\" class=\"rp-gh-app-switcher-product\" ng-href=\"{{product.data.productUrl}}\" ng-repeat=\"product in model.allProducts\"><span svg-src=\"{{product.data.titleIDGuid | rpGhIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"product.data.title | htmlUnsafe\"></span></span></a></div></div><a href=\"{{data.manageUrl}}\" class=\"rp-gh-app-switcher-manage\">{{model.manageLinkText}}</a></div>");
$templateCache.put("realpage/global-header/templates/header.html",
"<div class=\"rp-gh\"><rp-global-nav-toggle></rp-global-nav-toggle><p class=\"rp-gh-logo\"><a href=\"{{model.data.logoLink}}\"><img class=\"rp-gh-logo-img\" ng-src=\"{{model.data.logoImgSrc}}\" alt=\"logo\"></a></p><p class=\"rp-gh-product-name\" ng-if=\"model.data.productName\"><a href=\"{{model.data.productLink}}\">{{model.data.productName}}</a></p><div class=\"rp-gh-user-links\"><div class=\"rp-gh-user-links-toggle\"><rp-toggle model=\"showUserLinks\" options=\"{bodyToggle: true,\n" +
"                    activeText: model.data.username}\" class=\"rp-gh-user-links-username\"></rp-toggle><div class=\"rp-gh-user-links-avatar\"><img ng-src=\"{{model.data.userAvatarUrl}}\"></div></div><ul ng-show=\"showUserLinks\" class=\"rp-gh-user-links-menu\"><li ng-click=\"link.activate()\" class=\"rp-gh-user-links-menu-item\" ng-repeat=\"link in model.userLinks.links\">{{link.data.text}}</li></ul></div><div class=\"rp-gh-toolbar\"><a class=\"rp-gh-toolbar-icon home\" href=\"{{model.data.homeUrl}}\"></a><div class=\"rp-gh-app-switcher\"><rp-toggle model=\"showAppSwitcherMenu\" options=\"{bodyToggle: true}\" class=\"rp-gh-toolbar-icon apps toggle\"></rp-toggle><rp-gh-app-switcher-menu model=\"model.appSwitcher\" ng-show=\"showAppSwitcherMenu\"><rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></div><a class=\"rp-gh-toolbar-icon help\" href=\"\"></a> <a class=\"rp-gh-toolbar-icon settings\" href=\"\"></a> <a class=\"rp-gh-toolbar-icon alerts\" href=\"\"></a></div></div>");
}]);

