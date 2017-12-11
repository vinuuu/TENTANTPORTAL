(function(angular) {
    "use strict";

    function Provider() {
        var prov = this;

        prov.links = {};
        prov.breadcrumbs = [];

        prov.setProduct = function(product) {
            prov.product = product;
            return prov;
        };

        prov.setHome = function(home) {
            prov.home = home;
            return prov;
        };

        prov.setLinks = function(links) {
            prov.links = links;
            return prov;
        };

        prov.setBreadcrumbs = function(breadcrumbs) {
            prov.breadcrumbs = breadcrumbs;
            return prov;
        };

        function provide($rootScope, $state, $location, $urlMatcherFactory, storage) {
            var model = {},
                ev = '$locationChangeSuccess',
                dataKey = "bdgtBreadcrumbsLinks";

            model.init = function() {
                model.home = prov.home;
                model.updateFromStorage();
                model.product = prov.product;
                $rootScope.$on('$locationChangeSuccess', model.setLinks);
                return model;
            };

            model.storageAvailable = function() {
                return storage.has(dataKey);
            };

            model.updateFromStorage = function() {
                if (model.storageAvailable()) {
                    var links = storage.get(dataKey);
                    Object.keys(links).forEach(function(key) {
                        angular.extend(prov.links[key], links[key]);
                    });
                }
            };

            model.setLinks = function(event, newUrl, oldUrl) {
                newUrl = newUrl.split('#')[1];
                oldUrl = oldUrl.split('#')[1];
                //model.backUrl = oldUrl;
                //model.currentUrl = newUrl;
                model.isVisible = false;
                for (var i = 0; i < prov.breadcrumbs.length; i++) {
                    var item = prov.breadcrumbs[i],
                        itemParams = item.params || {},
                        urlMatcher = $urlMatcherFactory.compile(item.url, { params: itemParams }),
                        params = urlMatcher.exec(newUrl);
                    if (params) {
                        if (!model.storageAvailable()) {
                            (item.links || []).forEach(function(key) {
                                var link = prov.links[key];
                                if (link.hasOwnProperty('replace')) {
                                    key = link.replace;
                                }
                                var breadcrumb = model.getBreadcrumbByName(key);
                                if (breadcrumb) {
                                    prov.links[key].href = $state.href(key, params);
                                    prov.links[key].text = breadcrumb.text;
                                }
                            });
                        }
                        model.isVisible = true;
                        model.updateLink(item.name, params, item.text);
                        model.hasBreadCrumb = item.backLink === undefined;
                        if (model.hasBreadCrumb) {
                            model.links = [];
                            (item.links || []).forEach(function(linkKey) {
                                var link = prov.links[linkKey];
                                if (link.hasOwnProperty('replace')) {
                                    model.links.push(prov.links[link.replace]);
                                } else {
                                    model.links.push(link);
                                }
                            });
                            model.setActivePage(item.text);
                        } else {
                            var backLink = prov.links[item.backLink];
                            for (var j = 0; item.links && j < item.links.length; j++) {
                                var link = prov.links[item.links[j]];
                                if (link.hasOwnProperty('href') && link.href.replace('#', '').toLowerCase() === oldUrl) {
                                    item.backLink = item.links[j];
                                    if (link.hasOwnProperty('replace')) {
                                        backLink = prov.links[link.replace];
                                    } else {
                                        backLink = link;
                                    }
                                    break;
                                }
                            }
                            model.backLink = backLink;
                        }
                        break;
                    }
                }

            };

            model.setActivePage = function(text) {
                model.activePage = {
                    text: text
                };
                return model;
            };

            model.goBack = function() {
                var url = "/";
                if (model.backLink) {
                    url = model.backLink.href.replace('#', '');
                } else if (model.links) {
                    url = model.links.last().href.replace('#', '');
                } else {
                    logc("rpBdgtBreadcrumbsModel: Cannot go back");
                }
                $location.path(url);
                return model;
            };

            model.getBreadcrumbByName = function(routeName) {
                var item;
                for (var i = 0; i < prov.breadcrumbs.length; i++) {
                    if (prov.breadcrumbs[i].name === routeName) {
                        item = prov.breadcrumbs[i];
                        break;
                    }
                }
                return item;
            };

            model.updateBackLink = function(ofRouteName, toRouteName) {
                var breadcrumb = model.getBreadcrumbByName(ofRouteName);
                if (breadcrumb && breadcrumb.backLink) {
                    breadcrumb.backLink = prov.links[toRouteName];
                }
                return model;
            };

            model.updateLink = function(routeName, params, text) {
                var link = prov.links[routeName];
                if (link) {
                    link.href = $state.href(routeName, params);
                    link.text = text || link.text;
                    storage.set("bdgtBreadcrumbsLinks", prov.links);
                } else {
                    logc("rpBdgtBreadcrumbsModel: Invalid link route name: " + routeName);
                }
                return model;
            };

            model.updateLinkText = function(text) {
                var link = prov.links[$state.current.name];
                if (link) {
                    link.text = text || link.text;
                    model.setActivePage(link.text);
                    storage.set("bdgtBreadcrumbsLinks", prov.links);
                } else {
                    logc("rpBdgtBreadcrumbsModel: Invalid link route name: " + $state.current.name);
                }
                return model;
            };

            return model.init();
        }

        prov.$get = [
            '$rootScope',
            '$state',
            '$location',
            '$urlMatcherFactory',
            'rpSessionStorage',
            provide
        ];
    }

    angular
        .module("ui")
        .provider("rpBdgtBreadcrumbsModel", [Provider]);
})(angular);