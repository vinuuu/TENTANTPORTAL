angular.module("rpGlobalHeader", []);

//  Source: _lib\realpage\global-header\js\controllers\app-switcher-menu.js
//  App Switcher Controller

(function (angular, undefined) {
    "use strict";

    function RpGhAppSwitcherMenuCtrl($scope, model, tabsMenuData) {
        var vm = this;

        vm.init = function () {
            $scope.model = model;
            $scope.tabsData = tabsMenuData.getData();
            $scope.tabsMenu = tabsMenuData.getTabsMenu();
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
        .controller("RpGhAppSwitcherMenuCtrl", [
            "$scope",
            "rpGhAppSwitcherMenuModel",
            "rpGhAppSwitcherTabsData",
            RpGhAppSwitcherMenuCtrl
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


//  Source: _lib\realpage\global-header\js\directives\app-switcher.js
//  App Switcher Directive

(function (angular, undefined) {
    "use strict";

    function rpGhAppSwitcher() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/global-header/templates/app-switcher.html"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhAppSwitcher", [rpGhAppSwitcher]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\app-switcher-menu.js
//  Global Header App Switcher Directive

(function (angular) {
    "use strict";

    function rpGhAppSwitcherMenu() {
        function link(scope, elem, attr) {}

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            controller: "RpGhAppSwitcherMenuCtrl as appSwitcherMenu",
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

//  Source: _lib\realpage\global-header\js\directives\user-links-toggle.js
//  User Links Menu Toggle Directive

(function (angular, undefined) {
    "use strict";

    function rpGhUserLinksToggle(timeout) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.userLinks = dir;
                dir.on = false;
                dir.click = "click.headerUserLinksMenu";
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.toggleMenu = function () {
                if (!dir.on) {
                    timeout(dir.bindHide, 10);
                }

                dir.on = !dir.on;
            };

            dir.bindHide = function () {
                dir.body = dir.body || angular.element("body");
                dir.body.one(dir.click, dir.onBodyClick);
            };

            dir.hideMenu = function () {
                dir.on = false;
            };

            dir.onBodyClick = function () {
                scope.$apply(dir.hideMenu);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhUserLinksToggle", ["timeout", rpGhUserLinksToggle]);
})(angular);

//  Source: _lib\realpage\global-header\js\directives\nav-pref.js
//  Nav Prefs Directive

(function (angular, undefined) {
    "use strict";

    function rpGhNavPrefs(timeout, pubsub) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.pref = {
                    dark: false
                };

                scope.ghNav = dir;
                timeout(dir.onChange, 300);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function () {
                pubsub.publish("gn.themeUpdate", dir.pref);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGlobalHeader")
        .directive("rpGhNavPrefs", ["timeout", "pubsub", rpGhNavPrefs]);
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


//  Source: _lib\realpage\global-header\js\models\app-switcher-tabs-data.js
//  Global Header App Switcher Tabs Data

(function (angular) {
    "use strict";

    function AppSwitcherTabsData(scrollingTabsMenu) {
        var data,
            svc = this;

        data = {
            families: {
                id: "01",
                isActive: false
            },

            favorites: {
                id: "02",
                isActive: true
            }
        };

        svc.setText = function (textData) {
            angular.forEach(textData, function (val, key) {
                data[key]["text"] = val;
            });
        };

        // Getters

        svc.getData = function () {
            return data;
        };

        svc.getTabsMenu = function () {
            return scrollingTabsMenu([
                data.families,
                data.favorites
            ]);
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
            "rpScrollingTabsMenuModel",
            AppSwitcherTabsData
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\app-switcher-menu.js
//  App Switcher Model

(function (angular, undefined) {
    "use strict";

    function factory(tabsData) {
        function RpGhAppSwitcherMenuModel() {
            var s = this;
            s.init();
        }

        var p = RpGhAppSwitcherMenuModel.prototype;

        p.init = function () {
            var s = this;
            s.families = [];
            s.solutions = [];
            s.manageLink = {
                url: "",
                text: ""
            };
        };

        // Setters

        p.setData = function (data) {
            var s = this,
                favCount = 0;

            s.families = data.families;
            s.solutions = data.solutions;
            s.manageLinkText = data.manageLinkText;

            s.solutions.forEach(function (soln) {
                if (soln.isFavorite()) {
                    favCount++;
                }
            });

            tabsData.activateTab(favCount === 0 ? "families" : "favorites");

            return s;
        };

        p.setTabsText = function (data) {
            var s = this;
            tabsData.setText(data);
            return s;
        };

        p.setManageLink = function (data) {
            var s = this;
            angular.extend(s.manageLink, data);
            return s;
        };

        return new RpGhAppSwitcherMenuModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhAppSwitcherMenuModel", [
            "rpGhAppSwitcherTabsData",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\global-header.js
//  Global Header Model

(function (angular, undefined) {
    "use strict";

    function factory(cdnVer, toolbarIcons, appSwitcher, userLinks) {
        function GlobalHeaderModel() {
            var s = this;
            s.init();
        }

        var p = GlobalHeaderModel.prototype;

        p.init = function () {
            var s = this;

            s.data = {
                showNavToggle: true,

                showLogo: true,
                logoLink: "",
                logoImg1Src: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-24x22.svg",
                logoImg2Src: "../" + cdnVer + "/lib/realpage/global-header/images/rp-logo-180x40.svg",

                showCompanyName: false,
                companyNameLink: "",
                companyNameText: "Company Name",

                showUserName: true,
                username: "",

                showInitials: true,
                initials: "",

                showUserAvatarImg: false,
                userAvatarUrl: "../" + cdnVer + "/lib/realpage/global-header/images/user-avatar.jpg"
            };

            s.userLinks = userLinks;
            s.toolbarIcons = toolbarIcons;
        };

        // Setters

        p.setToolbarIcons = function (data) {
            var s = this;
            s.toolbarIcons.setData(data);
            return s;
        };

        p.setUserLinks = function (data) {
            var s = this;
            s.userLinks.setData(data);
            return s;
        };

        // Actions

        p.extendData = function (data) {
            var s = this;
            angular.extend(s.data, data || {});
            return s;
        };

        return new GlobalHeaderModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGlobalHeaderModel", [
            "cdnVer",
            "rpGhToolbarIcons",
            "rpGhAppSwitcherMenuModel",
            "rpGhUserLinksModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\toolbar-icons.js
//  Global Header Toolbar Icons

(function (angular, undefined) {
    "use strict";

    function factory(linkSvc) {
        function ToolbarIcons() {
            var s = this;
            s.init();
        }

        var p = ToolbarIcons.prototype;

        p.init = function () {
            var s = this;

            s.list = [];

            s.data = {
                homeIcon: {
                    active: false,
                    className: "home"
                },

                appSwitcher: {
                    active: false,
                    isAppSwitcher: true
                },

                helpIcon: {
                    active: false,
                    className: "help",
                    method: s.showHelp.bind(s)
                },

                settingsIcon: {
                    active: false,
                    className: "settings"
                },

                shoppingCartIcon: {
                    active: false,
                    className: "shopping-cart"
                },

                notificationsIcon: {
                    active: false,
                    className: "notifications"
                }
            };

            s.setList(s.data);
        };

        p.setList = function (data) {
            var s = this;

            angular.forEach(s.data, function (val) {
                s.list.push(val);
            });

            return s;
        };

        p.setData = function (data) {
            var s = this;

            angular.forEach(data, function (val, key) {
                angular.extend(s.data[key], val);
            });

            return s;
        };

        p.showHelp = function () {
            var s = this;
            logc("show help!", arguments);
            return s;
        };

        p.invoke = function (link) {
            var s = this;
            linkSvc.invoke(link);
            return s;
        };

        return new ToolbarIcons();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhToolbarIcons", ["rpGhLinkSvc", factory]);
})(angular);

//  Source: _lib\realpage\global-header\js\models\user-links.js
//  User Links Model

(function (angular, undefined) {
    "use strict";

    function factory(linkSvc) {
        function UserLinksModel() {
            var s = this;
            s.init();
        }

        var p = UserLinksModel.prototype;

        p.init = function () {
            var s = this;
            s.links = [];
            s.visible = false;

            // s.links = [
            //     {
            //         "newWin": true,
            //         "text": "Client Portal",
            //         "url": "/product/clientportal"
            //     },
            //     {
            //         "text": "Manage Profile",
            //         "event": "manageProfile.rpGlobalHeader"
            //     },
            //     {
            //         "text": "Sign out",
            //         "event": "signout.rpGlobalHeader"
            //     }
            // ];
        };

        p.setData = function (links) {
            var s = this;
            s.links = links || [];
            return s;
        };

        p.invoke = function (link) {
            var s = this;
            linkSvc.invoke(link);
            return s;
        };

        p.toggleMenu = function () {
            var s = this;
            s.visible = !s.visible;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.links.flush();
        };

        return new UserLinksModel();
    }

    angular
        .module("rpGlobalHeader")
        .factory("rpGhUserLinksModel", [
            "rpGhLinkSvc",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\services\link.js
//  Global Header Link Service

(function (angular, undefined) {
    "use strict";

    function RpGhLinkSvc($window, $state, pubsub) {
        var svc = this;

        svc.invoke = function (data) {
            if (data.url) {
                svc.invokeLink(data);
            }
            else if (data.sref) {
                svc.invokeState(data);
            }
            else if (data.method) {
                svc.invokeMethod(data);
            }
            else if (data.event) {
                svc.invokeEvent(data);
            }
        };

        svc.invokeLink = function (data) {
            if (data.newWin) {
                var win = $window.open(data.url, "_blank");
                win.focus();
            }
            else {
                $window.location.href = data.url;
            }
        };

        svc.invokeState = function (data) {
            $state.go(data.sref, data.stateParams || {});
        };

        svc.invokeMethod = function (data) {
            data.method(data.args);
        };

        svc.invokeEvent = function (data) {
            pubsub.publish(data.event, data.eventData || {});
        };
    }

    angular
        .module("rpGlobalHeader")
        .service("rpGhLinkSvc", [
            "$window",
            "$state",
            "pubsub",
            RpGhLinkSvc
        ]);
})(angular);


//  Source: _lib\realpage\global-header\js\templates\templates.inc.js
angular.module("rpGlobalHeader").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/global-header/templates/app-switcher-menu.html",
"<div class=\"rp-gh-app-switcher-menu\"><div rp-stop-event=\"click\" class=\"rp-gh-app-switcher-menu-tabs\"><rp-scrolling-tabs-menu model=\"tabsMenu\"></rp-scrolling-tabs-menu></div><div class=\"rp-gh-app-switcher-menu-content\"><div ng-show=\"tabsData.families.isActive\" class=\"rp-gh-app-switcher-services\"><div class=\"rp-gh-app-switcher-service\" ng-repeat=\"family in model.families\"><div class=\"rp-gh-app-switcher-service-title\"><span svg-src=\"{{family.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-service-icon rp-svg-icon\"></span> {{::family.data.familyName}}</div><div class=\"rp-gh-app-switcher-product\" ng-repeat=\"soln in family.solutions\"><span svg-src=\"{{soln.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"soln.data.solutionName\"></span> </span><a ng-href=\"{{soln.data.productUrl}}\" ng-attr-target=\"{{soln.getWinId()}}\" class=\"rp-gh-app-switcher-product-link\"></a><div class=\"rp-gh-app-switcher-product-disabled\" ng-if=\"soln.isProductDisabled()\"></div></div></div></div><div ng-show=\"tabsData.favorites.isActive\" class=\"rp-gh-app-switcher-favorites\"><div ng-if=\"soln.isFavorite()\" class=\"rp-gh-app-switcher-product\" ng-repeat=\"soln in model.solutions\"><span svg-src=\"{{soln.getIconId() | productIconPath}}\" class=\"rp-gh-app-switcher-product-icon rp-svg-icon\"></span> <span class=\"rp-gh-app-switcher-product-title-wrap\"><span class=\"rp-gh-app-switcher-product-title\" ng-bind-html=\"soln.data.solutionName\"></span> </span><a ng-href=\"{{soln.data.productUrl}}\" ng-attr-target=\"{{soln.getWinId()}}\" class=\"rp-gh-app-switcher-product-link\"></a><div class=\"rp-gh-app-switcher-product-disabled\" ng-if=\"soln.isProductDisabled()\"></div></div></div></div><a ng-href=\"{{model.manageLink.url}}\" class=\"rp-gh-app-switcher-manage\">{{model.manageLink.text}}</a></div>");
$templateCache.put("realpage/global-header/templates/app-switcher.html",
"<div class=\"rp-gh-app-switcher\"><rp-toggle model=\"showAppSwitcherMenu\" options=\"{bodyToggle: true}\" class=\"rp-gh-toolbar-icon apps toggle\"></rp-toggle><rp-gh-app-switcher-menu ng-show=\"showAppSwitcherMenu\"><rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></rp-gh-app-switcher-menu></div>");
$templateCache.put("realpage/global-header/templates/header.html",
"<div class=\"rp-gh\"><rp-global-nav-toggle ng-if=\"model.data.showNavToggle\"></rp-global-nav-toggle><div class=\"rp-gh-logo\"><a href=\"{{model.data.logoLink}}\"><img class=\"rp-gh-logo-img-1\" ng-src=\"{{model.data.logoImg1Src}}\" alt=\"logo\"><!--\n" +
"            <img class=\"rp-gh-logo-img-2\" ng-src=\"{{model.data.logoImg2Src}}\" alt=\"logo\" />\n" +
"            --></a></div><div class=\"rp-gh-names\"><span class=\"rp-gh-name-rp\">RealPage</span><h1 class=\"rp-gh-name-company\" ng-if=\"model.data.showCompanyName\"><a href=\"{{model.data.companyNameLink}}\">{{model.data.companyNameText}}</a></h1></div><div class=\"rp-gh-user-links\"><div class=\"rp-gh-user-links-toggle\" ng-click=\"userLinks.toggleMenu()\"><div class=\"rp-gh-user-avatar\"><p class=\"rp-gh-user-initials\" ng-if=\"model.data.showInitials\">{{model.data.userInitials}}</p></div><div class=\"rp-gh-user-info\"><p class=\"rp-gh-user-name\">{{model.data.username}}</p><p class=\"rp-gh-user-role\">{{model.data.userRole}}</p></div></div><div ng-show=\"userLinks.on\" class=\"rp-gh-user-links-menu\"><ul class=\"rp-gh-user-links-list\"><li class=\"rp-gh-user-links-menu-item\" ng-click=\"model.userLinks.invoke(link)\" ng-repeat=\"link in model.userLinks.links\">{{link.text}}</li></ul><div rp-stop-event=\"click\" class=\"rp-gh-nav-prefs\"><div class=\"rp-gh-nav-pref\"><rp-switch class=\"label-1 theme-1\" rp-model=\"ghNav.pref.dark\" rp-on-change=\"ghNav.onChange()\" rp-label-text=\"'Dark Navigation'\"></rp-switch></div></div></div></div><div class=\"rp-gh-toolbar\"><div ng-if=\"icon.active\" class=\"rp-gh-toolbar-icon-wrap\" ng-repeat=\"icon in model.toolbarIcons.list\"><span data-badge=\"{{icon.count}}\" ng-if=\"icon.active && !icon.isAppSwitcher\" ng-click=\"model.toolbarIcons.invoke(icon)\" class=\"rp-gh-toolbar-icon {{icon.className}}\"></span><rp-gh-app-switcher ng-if=\"icon.active && icon.isAppSwitcher\"></rp-gh-app-switcher></div></div></div>");
}]);

