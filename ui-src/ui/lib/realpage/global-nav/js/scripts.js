//  Source: _lib\realpage\global-nav\js\plugin\init.js
// Global Nav Containers

var RealPage = RealPage || {};

(function (RealPage) {
    "use strict";

    RealPage.GlobalNav = {};
})(RealPage);

//  Source: _lib\realpage\global-nav\js\plugin\gn-html-submenu.js
// Global Nav Submenu Html

(function (_, gn) {
    "use strict";

    var menuStr = "" +

    "<% if (links && links.length > 0) { %>" +
        "<ul class='rp-global-nav-submenu <%- className %>'>" +
            "<% _.forEach(links, function(item, index, list) { %>" +
                "<li class='rp-global-nav-submenu-item <%- item.className %>'>" +
                    "<a href='<%- item.labelLink %>' " +
                        "class='rp-global-nav-submenu-item-label <%- item.labelClassName %>'>" +
                        "<%- item.labelText %>" +
                    "</a>" +
                "</li>" +
            "<% }); %>" +
        "</ul>" +
    "<% } %>";

    var menuTpl = _.template(menuStr);

    function getSubmenu(data) {
        return menuTpl(data).trim();
    }

    gn.getSubmenuHtml = getSubmenu;
})(window._, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-html-menu.js
// Global Nav Menu Html

(function (_, gn) {
    "use strict";

    var labelStr = "" +

    "<% if (labelLink) { %>" +
        "<a href='<%- labelLink %>' " +
            "class='rp-global-nav-menu-item-label <%- labelClassName %>'>" +
            "<span class='rp-global-nav-menu-item-label-icon <%- iconClassName %>'>" +
            "</span>" +
            "<span class='rp-global-nav-menu-item-label-text'>" +
                "<%- labelText %>" +
            "</span>" +
            "<% if (submenu.links && submenu.links.length !== 0) { %>" +
                "<span class='rp-global-nav-menu-item-label-toggle'></span>" +
            "<% } %>" +
        "</a>" +
    "<% } else { %>" +
        "<span class='rp-global-nav-menu-item-label <%- labelClassName %>'>" +
            "<span class='rp-global-nav-menu-item-label-icon <%- iconClassName %>'>" +
            "</span>" +
            "<span class='rp-global-nav-menu-item-label-text'>" +
                "<%- labelText %>" +
            "</span>" +
            "<% if (submenu.links && submenu.links.length !== 0) { %>" +
                "<span class='rp-global-nav-menu-item-label-toggle'></span>" +
            "<% } %>" +
        "</span>" +
    "<% } %>";

    var labelTpl = _.template(labelStr);

    var getLabel = function(data) {
        data = _.extend({
            labelLink: "",
            labelClassName: ""
        }, data);

        return labelTpl(data);
    };

    var menuItemStr = "" +

    "<li class='rp-global-nav-menu-item <%- className %>'>" +
        "<%= label %>" +
        "<%= submenu %>" +
    "</li>";

    var menuItemTpl = _.template(menuItemStr);

    function getMenuItem(data) {
        data = _.extend({
            submenu: {
                links: [],
                className: ""
            },
            className: "",
            labelText: "",
            iconClassName: "",
            labelClassName: ""
        }, data);

        return menuItemTpl({
            label: getLabel(data),
            className: data.className,
            submenu: gn.getSubmenuHtml(data.submenu)
        });
    }

    var menuStr = "" +

    "<% if (html) { %>" +
        "<div class='rp-global-nav-menu-wrap'>" +
            "<ul class='rp-global-nav-menu'>" +
                "<%= html %>" +
            "</ul>" +
        "</div>" +
    "<% } %>";

    var menuTpl = _.template(menuStr);

    function getMenu(data) {
        var html = "";
        data = data || [];

        data.forEach(function (menuItem) {
            html += getMenuItem(menuItem);
        });

        return menuTpl({
            html: html
        });
    }

    gn.getMenuHtml = getMenu;
})(window._, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-link.js
// Global Nav Link

(function (window, $) {
    "use strict";

    var id = 0,
        gn = window.RealPage.GlobalNav;

    function MenuLink(elem) {
        id++;
        var s = this;
        s.init(elem);
    }

    var p = MenuLink.prototype;

    p.init = function (elem) {
        var s = this;
        s.id = id;
        s.elem = elem;
        s.onClickCallback = function () {};
        elem.on("click", s.clickHandler.bind(s));
        return s;
    };

    p.activate = function (url) {
        var s = this,
            href = s.elem.attr("href"),
            hash = url.replace(/^.*(\#.*)$/, "$1");
        s.setActive(href == url || href == hash);
        return s;
    };

    p.setActive = function (bool) {
        var s = this;
        s.elem[bool ? "addClass" : "removeClass"]("active");
        return s;
    };

    p.onClick = function (callback) {
        var s = this;
        s.onClickCallback = callback;
        return s;
    };

    p.clickHandler = function () {
        var s = this;
        s.onClickCallback(s);
        return s;
    };

    p.is = function (link) {
        var s = this;
        return link.hasID(s.id);
    };

    p.hasID = function (id) {
        var s = this;
        return s.id == id;
    };

    p.hasUrl = function (url) {
        var s = this;
        return s.elem.attr("href") == url;
    };

    gn.menuLink = function (elem) {
        elem = $(elem);
        var menuLink = elem.data("menuLink");
        if (!menuLink) {
            menuLink = new MenuLink(elem);
            elem.data("menuLink", menuLink);
        }
        return menuLink;
    };
})(window, jQuery);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-menu-item.js
// Global Nav MenuItem

(function ($, gn) {
    "use strict";

    var id = 0;

    function MenuItem(elem) {
        id++;
        var s = this;
        s.init(elem);
    }

    var p = MenuItem.prototype;

    p.init = function (elem) {
        var s = this;

        s.id = id;
        s.open = false;
        s.menuItem = elem;
        s.openHeight = elem.prop("scrollHeight");
        s.label = elem.children(".rp-global-nav-menu-item-label");
        s.closedHeight = s.label.outerHeight();
        s.label.on("click", s.toggle.bind(s));
        s.menuItem.height(s.closedHeight);
        return s;
    };

    p.hasID = function (id) {
        var s = this;
        return s.id === id;
    };

    p.expand = function () {
        var s = this;
        s.open = true;
        s.menuItem.addClass("open");
        s.menuItem.height(s.openHeight);
        return s;
    };

    p.collapse = function () {
        var s = this;
        s.open = false;
        s.menuItem.removeClass("open");
        s.menuItem.height(s.closedHeight);
        return s;
    };

    p.isOpen = function () {
        var s = this;
        return s.open;
    };

    p.hasSubmenu = function () {
        var s = this;
        return !!s.menuItem.children(".rp-global-nav-submenu").length;
    };

    p.onActivate = function (callback) {
        var s = this;
        s.activateCallback = callback;
        return s;
    };

    p.is = function (item) {
        var s = this;
        return item.hasID(s.id);
    };

    p.toggle = function (event) {
        var s = this;
        s.activateCallback(s);
        event.stopPropagation();
        return s;
    };

    gn.menuItem = function (elem) {
        elem = $(elem);
        var menuItem = elem.data("menuItem");
        if (!menuItem) {
            menuItem = new MenuItem(elem);
            elem.data("menuItem", menuItem);
        }
        return menuItem;
    };
})(jQuery, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-class-menu.js
// Global Nav Menu

(function (window, $) {
    "use strict";

    var gn = window.RealPage.GlobalNav;

    function Menu(elem) {
        var s = this;
        s.init(elem);
    }

    var p = Menu.prototype;

    p.init = function (elem) {
        var s = this,
            url = window.location.href;
        s.menu = elem;
        s.onLinkActivateCallback = function () {};
        s.genMenuItems().genLinks().bindEvents().initActiveLink(url);
        return s;
    };

    p.genMenuItems = function () {
        var s = this,
            menuItemElems = s.menu.children(".rp-global-nav-menu-item");

        s.menuItems = [];

        menuItemElems.each(function (index, menuItemElem) {
            var menuItem = gn.menuItem(menuItemElem);
            menuItem.onActivate(s.toggleMenuItem.bind(s));
            s.menuItems.push(menuItem);
        });

        return s;
    };

    p.genLinks = function () {
        var s = this,
            menuLinkElems = s.menu.find("a");

        s.menuLinks = [];

        menuLinkElems.each(function (index, menuLinkElem) {
            var menuLink = gn.menuLink(menuLinkElem);
            menuLink.onClick(s.activateLink.bind(s));
            s.menuLinks.push(menuLink);
        });

        return s;
    };

    p.activateLink = function (item) {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.setActive(menuLink.is(item));
        });
        s.onLinkActivateCallback();
        return s;
    };

    p.bindEvents = function () {
        var s = this;
        $(window).on("hashchange", s.hashchangeHandler.bind(s));
        return s;
    };

    p.hashchangeHandler = function () {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.activate(window.location.hash);
        });
        s.menuItems.forEach(function (menuItem) {
            menuItem.collapse();
        });
        return s;
    };

    p.initActiveLink = function (url) {
        var s = this;
        s.menuLinks.forEach(function (menuLink) {
            menuLink.activate(url);
        });
        return s;
    };

    p.toggleMenuItem = function (item) {
        var s = this;
        if (item.isOpen()) {
            item.collapse();
        }
        else {
            item.expand();
            s.menuItems.forEach(function (menuItem) {
                if (!menuItem.is(item) && menuItem.isOpen()) {
                    menuItem.collapse();
                }
            });
        }
        return s;
    };

    p.onLinkActivate = function (callback) {
        var s = this;
        s.onLinkActivateCallback = callback;
        return s;
    };

    gn.menu = function (elem) {
        var menu = elem.data("menu");
        if (!menu) {
            menu = new Menu(elem);
            elem.data("menu", menu);
        }
        return menu;
    };
})(window, jQuery);

//  Source: _lib\realpage\global-nav\js\plugin\gn-plugin.js
// Global Nav Plugin

(function ($, gn) {
    "use strict";

    function GlobalNav(elem, data) {
        var s = this;
        s.init(elem, data);
    }

    var p = GlobalNav.prototype;

    p.init = function (elem, data) {
        var s = this,
            elemHtml = gn.getMenuHtml(data);

        gn.inst = s;
        s.elem = elem;
        elem.html(elemHtml);

        setTimeout(function () {
            s.width = elem.outerWidth();
            s.menu = gn.menu(elem.children().children().eq(0));
            s.menu.onLinkActivate(s.hide.bind(s));
        }, 100);
    };

    p.show = function () {
        var s = this;
        s.visible = true;
        s.elem.css("left", 0);
        return s;
    };

    p.hide = function () {
        var s = this;
        s.visible = false;
        s.elem.css("left", -s.width);
        return s;
    };

    p.toggle = function () {
        var s = this;
        s[s.visible ? "hide" : "show"]();
        return s;
    };

    p.isVisible = function () {
        var s = this;
        return s.visible;
    };

    p.stopClickProp = function (event) {
        event.stopPropagation();
    };

    $.fn.rpGlobalNav = function (navData) {
        return this.each(function () {
            var elem = $(this);
            if (!elem.data("globalNav")) {
                elem.data("globalNav", new GlobalNav(elem, navData));
            }
        });
    };
})(jQuery, RealPage.GlobalNav);

//  Source: _lib\realpage\global-nav\js\plugin\gn-toggle-plugin.js
// Global Nav Toggle Plugin

(function ($, gn) {
    "use strict";

    function GlobalNavToggle(elem) {
        var s = this;
        s.init(elem);
    }

    var p = GlobalNavToggle.prototype;

    p.init = function (elem) {
        var s = this;
        s.body = $("body");
        elem.on("click", s.toggleNav.bind(s));
        return s;
    };

    p.toggleNav = function (event) {
        var s = this;
        gn.inst.toggle();
        setTimeout(s.bindFollowup.bind(s), 10);
        return s;
    };

    p.bindFollowup = function () {
        var s = this;
        if (gn.inst.isVisible()) {
            s.body.one("click.globalNav", s.bodyClickHandler.bind(s));
        }
        else {
            s.body.off("click.globalNav");
        }
        return s;
    };

    p.bodyClickHandler = function () {
        var s = this;
        gn.inst.hide();
        return s;
    };

    $.fn.rpGlobalNavToggle = function () {
        return this.each(function () {
            var elem = $(this);
            if (!elem.data("globalNavToggle")) {
                elem.data("globalNavToggle", new GlobalNavToggle(elem));
            }
        });
    };
})(jQuery, RealPage.GlobalNav);


angular.module("rpGlobalNav", []);

//  Source: _lib\realpage\global-nav\js\directives\global-nav-toggle.js
//  Global Nav Toggle Directive

(function (angular) {
    "use strict";

    function rpGlobalNavToggle() {
        function link(scope, elem, attr) {
            elem.rpGlobalNavToggle();
        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-global-nav-toggle'></div>"
        };
    }

    angular
        .module("rpGlobalNav")
        .directive("rpGlobalNavToggle", [rpGlobalNavToggle]);
})(angular);

//  Source: _lib\realpage\global-nav\js\directives\global-nav.js
//  Global Nav Directive

(function (angular) {
    "use strict";

    function rpGlobalNav(pubsub, model) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                if (model.isReady()) {
                    dir.initNav();
                }
                else {
                    model.subscribe(dir.initNav);
                }

                dir.prefWatch = pubsub.subscribe("gn.themeUpdate", dir.updatePref);
            };

            dir.initNav = function () {
                elem.rpGlobalNav(model.getData());
            };

            dir.updatePref = function (data) {
                elem[!data.dark ? "addClass" : "removeClass"]("theme-1");
            };

            dir.init();
        }

        return {
            scope: {},
            link: link,
            restrict: "E",
            replace: true,
            template: "<div class='rp-global-nav'></div>"
        };
    }

    angular
        .module("rpGlobalNav")
        .directive("rpGlobalNav", ["pubsub", "rpGlobalNavModel", rpGlobalNav]);
})(angular);

//  Source: _lib\realpage\global-nav\js\models\global-nav.js
//  Global Nav Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        function GlobalNavModel() {
            var s = this;
            s.init();
        }

        var p = GlobalNavModel.prototype;

        p.init = function () {
            var s = this;
            s.data = [];
            s.ready = false;
            s.update = eventStream();
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data;
            s.ready = true;
            s.publish(data);
            return s;
        };

        // Actions

        p.publish = function (data) {
            var s = this;
            s.update.publish(data);
            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.update.subscribe.apply(s.update, arguments);
        };

        // Assertions

        p.isReady = function () {
            var s = this;
            return s.ready;
        };

        p.reset = function () {
            var s = this;
            s.data = [];
        };

        return new GlobalNavModel();
    }

    angular
        .module("rpGlobalNav")
        .factory("rpGlobalNavModel", ["eventStream", factory]);
})(angular);
