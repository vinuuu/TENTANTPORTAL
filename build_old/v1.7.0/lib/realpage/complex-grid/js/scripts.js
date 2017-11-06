//  Source: _lib\realpage\complex-grid\js\_bundle.inc
angular.module("rpComplexGrid", []);

//  Source: _lib\realpage\complex-grid\js\templates\templates.inc.js
angular.module('rpComplexGrid').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/complex-grid/templates/grid-editable.html",
"<div class=\"rp-cg-editable\"><span class=\"rp-cg-text rp-cg-body-text\" ng-bind=\"column.val.toLocaleString() || '&nbsp;'\"></span><div class=\"rp-input-text small\"><input ng-model=\"column.val\" ng-change=\"column.triggerUpdate()\" ng-model-options=\"{updateOn: 'blur'}\" class=\"rp-cg-input-text rp-form-input\" type=\"{{column.config.dataType || 'text'}}\"></div></div>");
$templateCache.put("realpage/complex-grid/templates/grid-headers.html",
"<div class=\"rp-cg-headers\" rp-sticky=\"{lockTop: 90}\"><div class=\"rp-cg-locked rp-cg-headers-locked\" ng-style=\"{width: model.getLockedWidth()}\"><table class=\"rp-cg-table rp-cg-table-locked rp-cg-headers-table\"><tr class=\"rp-cg-row rp-cg-group-header-row\" ng-repeat=\"groupHeaders in model.groupHeaderRows\"><td colspan=\"{{groupHeader.getColSpan()}}\" ng-repeat=\"groupHeader in groupHeaders\" ng-if=\"groupHeader.isLocked() && groupHeader.isActive()\" class=\"rp-cg-cell rp-cg-group-header-cell {{groupHeader.data.classNames}}\"><div class=\"rp-cg-cell-inner rp-cg-group-header-cell-inner\"><span class=\"rp-cg-text rp-cg-group-header-text\">{{::groupHeader.data.text || '&nbsp;'}}</span></div></td></tr><tr class=\"rp-cg-row rp-cg-headers-row\"><td ng-repeat=\"header in model.headers\" ng-style=\"{width: header.config.width}\" colspan=\"{{header.config.colspan || 1}}\" rowspan=\"{{header.config.rowspan || 1}}\" ng-if=\"header.isLocked() && header.isActive()\" class=\"rp-cg-cell rp-cg-headers-cell {{::header.config.classNames}} {{::header.config.key.decamelize()}}\"><div class=\"rp-cg-cell-inner rp-cg-headers-cell-inner\"><span ng-class=\"header.sort\" ng-click=\"model.sortBy(header)\" class=\"rp-cg-text rp-cg-headers-text\">{{::header.config.text || '&nbsp;'}}</span></div></td></tr></table></div><div class=\"rp-cg-free rp-cg-headers-free\"><table ng-style=\"{width: model.getFreeWidth()}\" class=\"rp-cg-table rp-cg-table-free rp-cg-headers-table\"><tr class=\"rp-cg-row rp-cg-group-header-row\" ng-repeat=\"groupHeaders in model.groupHeaderRows\"><td colspan=\"{{groupHeader.getColSpan()}}\" ng-repeat=\"groupHeader in groupHeaders\" ng-if=\"!groupHeader.isLocked() && groupHeader.isActive()\" class=\"rp-cg-cell rp-cg-group-header-cell {{groupHeader.data.classNames}}\"><div class=\"rp-cg-cell-inner rp-cg-group-header-cell-inner\"><span class=\"rp-cg-text rp-cg-group-header-text\">{{::groupHeader.data.text || '&nbsp;'}}</span></div></td></tr><tr class=\"rp-cg-row rp-cg-headers-row\"><td ng-repeat=\"header in model.headers\" ng-style=\"{width: header.config.width}\" colspan=\"{{header.config.colspan || 1}}\" rowspan=\"{{header.config.rowspan || 1}}\" ng-if=\"!header.isLocked() && header.isActive()\" class=\"rp-cg-cell rp-cg-headers-cell {{::header.config.classNames}} {{::header.config.key.decamelize()}}\"><div class=\"rp-cg-cell-inner rp-cg-headers-cell-inner\"><span ng-class=\"header.sort\" ng-click=\"model.sortBy(header)\" class=\"rp-cg-text rp-cg-headers-text\">{{::header.config.text || '&nbsp;'}}</span></div></td></tr></table></div></div>");
$templateCache.put("realpage/complex-grid/templates/grid.html",
"<div ng-class=\"model.state\" class=\"rp-cg {{model.rowHeightClass}}\"><rp-cg-headers model=\"model.headers\"></rp-cg-headers><rp-busy-indicator model=\"model.busyModel\"></rp-busy-indicator><div class=\"rp-cg-body\" ng-class='{\"highlight-alternate-row\": model.highlightAlternateRow}'><div class=\"rp-cg-locked rp-cg-body-locked\"><table class=\"rp-cg-table\" ng-style=\"{width: model.getLockedWidth()}\"><tr rp-cg-body-row ng-class=\"row.state\" ng-click=\"row.toggle()\" ng-repeat=\"row in model.rows\" ng-if=\"!row.state.hidden && !row.state.zeroRow\"><td class=\"rp-cg-cell rp-cg-body-cell\" ng-repeat=\"column in row.activeColumns\" ng-if=\"column.isLocked() && column.isActive()\"><div class=\"rp-cg-cell-inner rp-cg-body-cell-inner\"><span class=\"rp-cg-text rp-cg-body-text\" title=\"{{column.val.toLocaleString()}}\" ng-bind=\"column.val.toLocaleString() || '&nbsp;'\"></span></div></td></tr></table></div><div class=\"rp-cg-free rp-cg-body-free rp-float-scroll\"><table class=\"rp-cg-table\" ng-style=\"{width: model.getFreeWidth()}\"><tr rp-cg-body-row ng-class=\"row.state\" ng-click=\"row.toggle()\" ng-repeat=\"row in model.rows\" ng-if=\"!row.state.hidden && !row.state.zeroRow\"><td class=\"rp-cg-cell rp-cg-body-cell\" ng-repeat=\"column in row.activeColumns\" ng-if=\"!column.isLocked() && column.isActive()\"><div class=\"rp-cg-cell-inner rp-cg-body-cell-inner\"><span class=\"rp-cg-text rp-cg-body-text\" title=\"{{column.val.toLocaleString()}}\" ng-bind=\"column.val.toLocaleString() || '&nbsp;'\"></span></div></td></tr></table></div><div class=\"rp-cg-empty\" ng-show=\"!model.rows.length\"><div class=\"empty-msg\" ng-bind-html=\"model.emptyMsg\"></div></div></div></div>");
}]);


//  Source: _lib\realpage\complex-grid\js\directives\grid-body-cell.js
//  Complex Grid Body Cell Directive

(function (angular, undefined) {
    "use strict";

    function rpCgBodyCell($templateCache, $compile) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.config = scope.column.config;

                if (dir.config.templateUrl) {
                    dir.assembleChild().appendChild();
                }

                scope.rpCgBodyCell = dir;
                dir.addClassNames().setWidth();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.assembleChild = function () {
                var url = dir.config.templateUrl,
                    html = $templateCache.get(url);

                if (html) {
                    dir.child = angular.element(html);
                    dir.child = $compile(dir.child)(scope);
                }
                else {
                    logw("rpCgBodyCell.assembleChild: template for url " + url + " is undefined!");
                }
                return dir;
            };

            dir.addClassNames = function () {
                var cfg = dir.config,
                    classNames = cfg.key.decamelize() + " " + (cfg.classNames || "");
                elem.addClass(classNames);
                return dir;
            };

            dir.appendChild = function () {
                if (dir.child) {
                    elem.children().html("").append(dir.child);
                }
                return dir;
            };

            dir.setWidth = function () {
                elem.css({
                    width: scope.column.getWidth(),
                    maxWidth: scope.column.getWidth()
                });
                return dir;
            };

            dir.destroy = function () {
                if (dir.child) {
                    dir.child.remove();
                }
                dir.destWatch();
                dir.child = undefined;
                dir.config = undefined;
                scope.rpCgBodyCell = undefined;
                elem = undefined;
                attr = undefined;
                scope = undefined;
                dir = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpComplexGrid")
        .directive("rpCgBodyCell", ["$templateCache", "$compile", rpCgBodyCell]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid-body-free.js
//  Complex Grid Body Free Directive

(function (angular, undefined) {
    "use strict";

    function rpCgBodyFree(evn) {
        function link(scope, elem, attr) {
            var model,
                dir = {};

            dir.init = function () {
                model = scope.model;
                scope.rpCgBodyFree = dir;
                elem.on("scroll", dir.onScroll);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.resizeWatch = model.subscribe(evn.resize, dir.onResize);
            };

            dir.onScroll = function () {
                model.publish(evn.scroll, elem.scrollLeft());
            };

            dir.onResize = function (data) {
                elem.width(data.availWidth - data.lockedWidth);
            };

            dir.destroy = function () {
                elem.off();
                dir.destWatch();
                dir.resizeWatch();
                scope.rpCgBodyFree = undefined;
                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
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
        .module("rpComplexGrid")
        .directive("rpCgBodyFree", [
            "rpCgEventName",
            rpCgBodyFree
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid-body-row.js
//  Complex Grid Body Row Directive

(function (angular, undefined) {
    "use strict";

    function rpCgBodyRow(timeout, winSize, winScroll, evn) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                dir.addClassNames();
                scope.row.setVisibilityChecker(dir.isVisible);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.addClassNames = function () {
                elem.addClass(scope.row.getClassNames());
                return dir;
            };

            dir.isVisible = function () {
                var offsetTop = elem.offset().top,
                    scrollTop = winScroll.getScrollTop(),
                    winHeight = winSize.getSize().height;

                return (offsetTop > scrollTop) && (offsetTop < (scrollTop + winHeight));
            };

            dir.destroy = function () {
                dir.destWatch();
                timeout.cancel(dir.timer);
                scope.row.setVisibilityChecker();

                dir = undefined;
                attr = undefined;
                elem = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "A"
        };
    }

    angular
        .module("rpComplexGrid")
        .directive("rpCgBodyRow", [
            "timeout",
            "windowSize",
            "windowScroll",
            "rpCgEventName",
            rpCgBodyRow
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid-headers-free.js
//  Complex Grid Headers Free Directive

(function (angular, undefined) {
    "use strict";

    function rpCgHeadersFree(evn) {
        function link(scope, elem, attr) {
            var model,
                dir = {};

            dir.init = function () {
                if (scope.model) {
                    model = scope.model;
                    dir.resizeWatch = model.subscribe(evn.resize, dir.setSize);
                    dir.scrollWatch = model.subscribe(evn.scroll, dir.onScroll);
                    dir.destWatch = scope.$on('$destroy', dir.destroy);
                    scope.rpCgHeadersFree = dir;
                }
            };

            dir.onScroll = function (scrollLeft) {
                elem.scrollLeft(scrollLeft);
            };

            dir.setSize = function (data) {
                elem.width(data.availWidth - data.lockedWidth);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.scrollWatch();
                dir.resizeWatch();
                scope.rpCgHeadersFree = undefined;
                dir = undefined;
                attr = undefined;
                elem = undefined;
                model = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpComplexGrid")
        .directive('rpCgHeadersFree', [
            'rpCgEventName',
            rpCgHeadersFree
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid-headers.js
//  Complex Grid Headers Directive

(function (angular, undefined) {
    "use strict";

    function rpCgHeaders(evn) {
        function link(scope, elem, attr) {
            var model,
                dir = {};

            dir.init = function () {
                if (scope.model) {
                    model = scope.model;
                    scope.rpCgHeaders = dir;
                    dir.destWatch = scope.$on('$destroy', dir.destroy);
                    dir.resizeWatch = model.subscribe(evn.resize, dir.onResize);
                }
            };

            dir.onResize = function (data) {
                elem.width(data.availWidth);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.resizeWatch();
                scope.rpCgHeaders = undefined;
                dir = undefined;
                elem = undefined;
                attr = undefined;
                scope = undefined;
                model = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/complex-grid/templates/grid-headers.html"
        };
    }

    angular
        .module("rpComplexGrid")
        .directive('rpCgHeaders', [
            'rpCgEventName',
            rpCgHeaders
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid-options.js
//  Complex Grid Options Directive

(function (angular, undefined) {
    "use strict";

    function rpCgOptions($parse, timeout, eventName) {
        function link(scope, elem, attr) {
            var body,
                dir = {};

            dir.init = function () {
                dir.visible = false;
                scope.rpCgOptions = dir;
                dir.grid = $parse(attr.targetGrid)(scope);
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.body = function () {
                body = body || angular.element("body");
                return body;
            };

            dir.toggle = function () {
                dir.visible = !dir.visible;

                if (dir.visible) {
                    timeout(dir.bind);
                }
                else {
                    dir.body().off("click.rpCgOptions");
                }
            };

            dir.bind = function () {
                dir.body().on("click.rpCgOptions", dir.hide);
            };

            dir.hide = function () {
                scope.$apply(function () {
                    dir.visible = false;
                });

                dir.body().off("click.rpCgOptions");
            };

            dir.updateLayout = function () {
                dir.grid.publish(eventName.dataReady);
            };

            dir.updateColumns = function () {
                dir.grid.publish(eventName.updateColumns);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.visible = false;
                scope.rpCgOptions = undefined;
                dir = undefined;
                body = undefined;
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
        .module("rpComplexGrid")
        .directive("rpCgOptions", ["$parse", "timeout", "rpCgEventName", rpCgOptions]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\directives\grid.js
//  Complex Grid Directive

(function (angular, undefined) {
    "use strict";

    function rpCg(timeout, evn, windowSize, windowScroll) {
        function link(scope, elem, attr) {
            var model,
                dir = {};

            dir.init = function () {
                dir.initRuler();
                scope.rpCg = dir;
                model = scope.model;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
                dir.resizeWatch = windowSize.subscribe(dir.setWidth);
                dir.winScrollWatch = windowScroll.subscribe(dir.setColumns);
                dir.readyWatch = model.subscribe(evn.dataReady, dir.setWidth);
                dir.scrollWatch = model.subscribe(evn.updateScroll, dir.updateScroll);
            };

            dir.initRuler = function () {
                dir.ruler = angular.element("<div class='rp-cg-ruler' />");
                elem.after(dir.ruler);
            };

            dir.removeBusy = function () {
                elem.removeClass("busy");
            };

            dir.updateScroll = function () {
                dir.timer = timeout(scope.floatScroll.delaySetSize, 10);
            };

            dir.getAvailableWidth = function () {
                return dir.ruler.width() - 20;
            };

            dir.calcWidth = function () {
                var totalWidth = model.getTotalWidth(),
                    availWidth = dir.getAvailableWidth(),
                    lockedWidth = model.getLockedWidth();

                availWidth = availWidth > totalWidth ? totalWidth : availWidth;

                return {
                    availWidth: availWidth,
                    lockedWidth: lockedWidth
                };
            };

            dir.setWidth = function () {
                var widthData = dir.calcWidth();

                elem.css("maxWidth", model.getTotalWidth());
                dir.updateScroll();
                model.publish(evn.resize, widthData).setColumns();
                dir.removeBusyTimer = timeout(dir.removeBusy, 10);
            };

            dir.setColumns = function () {
                model.delaySetColumns();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.readyWatch();
                dir.resizeWatch();
                dir.scrollWatch();
                dir.ruler.remove();
                dir.winScrollWatch();
                timeout.cancel(dir.timer);
                timeout.cancel(dir.removeBusyTimer);
                dir.ruler = undefined;
                scope.rpCg = undefined;
                dir = undefined;
                elem = undefined;
                attr = undefined;
                scope = undefined;
                model = undefined;
            };

            dir.init();
        }

        return {
            scope: {
                model: "="
            },
            link: link,
            restrict: "E",
            replace: true,
            templateUrl: "realpage/complex-grid/templates/grid.html"
        };
    }

    angular
        .module("rpComplexGrid")
        .directive("rpCg", [
            "timeout",
            "rpCgEventName",
            "windowSize",
            "windowScroll",
            rpCg
        ]);
})(angular);


//  Source: _lib\realpage\complex-grid\js\filters\grid-filter.js
//  Complex Grid Filter

(function (angular) {
    "use strict";

    function filter(filters) {
        return function (data, dataType) {
            if (filters.hasFilter(dataType)) {
                return filters.getFilter(dataType)(data);
            }
            else {
                return data;
            }
        };
    }

    angular
        .module("rpComplexGrid")
        .filter('rpCgFilter', ['rpCgFilters', filter]);
})(angular);


//  Source: _lib\realpage\complex-grid\js\models\grid-column.js
//  Complex Grid Column Model

(function (angular, undefined) {
    "use strict";

    function factory(evn) {
        function GridColumn() {
            var s = this;
            s.init();
        }

        var p = GridColumn.prototype;

        p.init = function () {
            var s = this;
            s.config = {
                classNames: ""
            };
            s.val = "";
            return s;
        };

        // Setters

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            return s;
        };

        p.setConfig = function (config) {
            var s = this;
            angular.extend(s.config, config);
            return s;
        };

        p.setData = function (colData) {
            var s = this;
            s.colData = colData;
            return s;
        };

        p.setVal = function (val) {
            var s = this;
            s.val = val !== undefined ? val : "";
            return s;
        };

        // Getters

        p.getKey = function () {
            var s = this;
            return s.config.key;
        };

        p.getKeyData = function () {
            var s = this;
            return s.colData[s.config.key];
        };

        p.getMethodName = function () {
            var s = this;
            return s.config.methodName;
        };

        p.getConfig = function () {
            var s = this;
            return s.config;
        };

        p.getWidth = function () {
            var s = this;
            return s.config.width;
        };

        // Assertions

        p.isLocked = function () {
            var s = this;
            return s.config.state.locked;
        };

        p.isActive = function () {
            var s = this;
            return s.config.state.active;
        };

        p.isDataColumn = function () {
            var s = this;
            return s.config.isDataColumn;
        };

        p.hasVal = function (val) {
            var s = this;
            return s.val === val;
        };

        // Actions

        p.triggerUpdate = function () {
            var s = this;
            s.colData[s.config.key] = s.val;
            s.events.publish(evn.updateVal);
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.val = undefined;
            s.events = undefined;
            s.config = undefined;
            s.colData = undefined;
        };

        return function () {
            return new GridColumn();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgColumnModel", ["rpCgEventName", factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-config.js
//  Grid Config Model

(function (angular, undefined) {
    "use strict";

    function factory(headersModel, methodsModel, rowConfigModel, groupHeadersSvc) {
        function GridConfig() {
            var s = this;
            s.init();
        }

        var p = GridConfig.prototype;

        p.init = function () {
            var s = this;
            s.headersModel = headersModel();
            s.methodsModel = methodsModel();
            s.rowConfigModel = rowConfigModel();
            s.emptyMsg = "No results were found.";
            s.highlightAlternateRow = true;
            return s;
        };

        // Setters

        p.setColHeaderGroups = function (columns, groupHeaderRows) {
            var s = this;
            groupHeadersSvc.assemble(columns, groupHeaderRows);
            return s.setGroupHeaderRows(groupHeaderRows);
        };

        p.setColumns = function (config) {
            var s = this;
            s.rowConfigModel.setBaseConfig(config);
            return s;
        };

        p.setEmptyMsg = function (emptyMsg) {
            var s = this;
            s.emptyMsg = emptyMsg;
            return s;
        };

        p.setGroupHeaderRows = function (data) {
            var s = this;
            s.headersModel.setGroupHeaderRows(data);
            return s;
        };

        p.setHeaders = function (data) {
            var s = this;
            s.rowConfigModel.setConfig("headers", data);
            return s;
        };

        p.setHighlightAlternateRow = function (bool) {
            var s = this;
            s.highlightAlternateRow = bool;
            return s;
        };

        p.setAlternateRow = p.setHighlightAlternateRow;

        p.setRowConfig = function (key, data) {
            var s = this;
            s.rowConfigModel.setConfig(key, data);
            return s;
        };

        // Getters

        p.getHeaders = function () {
            var s = this;
            return s.headersModel.setConfig(s.rowConfigModel).build();
        };

        p.getRowConfigModel = function () {
            var s = this;
            return s.rowConfigModel;
        };

        p.getEmptyMsg = function () {
            var s = this;
            return s.emptyMsg;
        };

        p.getAlternateRow = function () {
            var s = this;
            return s.highlightAlternateRow;
        };

        p.getTotalWidth = function () {
            var s = this;
            return s.rowConfigModel.getTotalWidth();
        };

        p.getLockedWidth = function () {
            var s = this;
            return s.rowConfigModel.getLockedWidth();
        };

        p.getFreeWidth = function () {
            var s = this;
            return s.rowConfigModel.getFreeWidth();
        };

        p.getMaxWidth = function () {
            var s = this;
            return s.rowConfigModel.getMaxWidth();
        };

        p.getMethod = function (methodName) {
            var s = this;
            return s.methodsModel.getMethod(methodName);
        };

        // Actions

        p.registerMethod = function (src, methodName) {
            var s = this;
            s.methodsModel.register(src, methodName);
            return s;
        };

        p.registerMethods = function (src, methods) {
            var s = this;

            methods.forEach(function (methodName) {
                s.registerMethod(src, methodName);
            });

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.headersModel.destroy();
            s.methodsModel.destroy();
            s.rowConfigModel.destroy();
            s.emptyMsg = undefined;
            s.headersModel = undefined;
            s.methodsModel = undefined;
            s.rowConfigModel = undefined;
            s.highlightAlternateRow = undefined;
            s.destroy = function () {};
        };

        return function () {
            return new GridConfig();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgConfigModel", [
            "rpCgHeadersModel",
            "rpCgMethodsModel",
            "rpCgRowConfigModel",
            "rpCgGroupHeadersSvc",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-event-name.js
//  Complex Grid Events Model

(function (angular) {
    "use strict";

    function factory() {
        return {
            resize: "resize",
            expRow: "expRow",
            colRow: "colRow",
            scroll: "scroll",
            sortBy: "sortBy",
            updateVal: "updateVal",
            dataReady: "dataReady",
            toggleRow: "toggleRow",
            widthReady: "widthReady",
            updateScroll: "updateScroll",
            updateColumns: "updateColumns"
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgEventName", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-filters.js
//  Complex Grid Filters Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridFilters() {
            var s = this;
            s.init();
        }

        var p = GridFilters.prototype;

        p.init = function () {
            var s = this;
            s.filters = {
                currency: function (data) {
                    data = parseFloat(data, 10);
                    return "$" + data.toLocaleString();
                }
            };
            return s;
        };

        p.register = function (filterName, filter) {
            var s = this;
            s.filters[filterName] = filter;
            return s;
        };

        p.hasFilter = function (filterName) {
            var s = this;
            return !!s.filters[filterName];
        };

        p.getFilter = function (filterName) {
            var s = this;
            return s.filters[filterName];
        };

        p.extendFilters = function (newFilters) {
            var s = this;
            angular.extend(s.filters, newFilters);
            return s;
        };

        return new GridFilters();
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgFilters", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-group-header.js
//  Grid Header Group Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GroupHeader() {
            var s = this;
            s.init();
        }

        var p = GroupHeader.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
            return s;
        };

        p.setData = function (data) {
            var s = this;
            angular.extend(s.data, data);
            return s;
        };

        p.isLocked = function () {
            var s = this;
            return s.data.locked;
        };

        p.isActive = function () {
            var s = this;
            return s.getColSpan() > 0;
        };

        p.getColSpan = function () {
            var s = this,
                activeCount = 0;

            s.data.subColumnStates.forEach(function (state) {
                if (state.active) {
                    activeCount++;
                }
            });

            return activeCount;
        };

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function () {
            return new GroupHeader();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgGroupHeaderModel", [
            factory
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-header.js
//  Grid Header Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridHeader() {
            var s = this;
            s.init();
        }

        var p = GridHeader.prototype;

        p.init = function () {
            var s = this;
            s.config = {};
            s.sort = {
                active: false,
                reverse: false
            };
            return s;
        };

        // Setters

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            return s;
        };

        // Getters

        p.getKey = function () {
            var s = this;
            return s.config.key;
        };

        p.getSortDir = function () {
            var s = this;
            return s.sort.reverse;
        };

        // Assertions

        p.is = function (obj) {
            var s = this;
            return s.getKey() == obj.getKey();
        };

        p.isLocked = function () {
            var s = this;
            return s.config.state.locked;
        };

        p.isActive = function () {
            var s = this;
            return s.config.state.active;
        };

        p.isSortable = function () {
            var s = this;
            return !!s.config.isSortable;
        };

        // Actions

        p.sortBy = function (activate) {
            var s = this;
            if (activate && !s.sort.active) {
                s.sort.active = true;
            }
            else if (activate && s.sort.active) {
                s.sort.reverse = !s.sort.reverse;
            }
            else {
                s.sort.active = false;
                s.sort.reverse = false;
            }
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
        };

        return function () {
            return new GridHeader();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgHeaderModel", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-headers.js
//  Grid Headers Model

(function (angular, undefined) {
    "use strict";

    function factory(headerModel, groupHeaderModel, evn) {
        function GridHeaders() {
            var s = this;
            s.init();
        }

        var p = GridHeaders.prototype;

        p.init = function () {
            var s = this;
            s.headers = [];
            s.groupHeaderRows = [];
            return s;
        };

        // Setters

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            return s;
        };

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            return s;
        };

        p.setGroupHeaderRows = function (groupHeaderRows) {
            var s = this;

            s.groupHeaderRows = [];

            groupHeaderRows.forEach(function (groupHeaderRow) {
                var row = [];

                groupHeaderRow.forEach(function (groupHeaderData) {
                    var groupHeader = groupHeaderModel().setData(groupHeaderData);
                    row.push(groupHeader);
                });

                s.groupHeaderRows.push(row);
            });

            return s;
        };

        // Getters

        p.getFreeWidth = function () {
            var s = this;
            return s.config.getFreeWidth();
        };

        p.getLockedWidth = function () {
            var s = this;
            return s.config.getLockedWidth();
        };

        // Actions

        p.publish = function () {
            var s = this;
            return s.events.publish.apply(s.events, arguments);
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        p.sortBy = function (header) {
            var s = this;

            if (!header.isSortable()) {
                return s;
            }

            s.headers.forEach(function (item) {
                var bool = item.is(header);
                item.sortBy(bool);
                if (bool) {
                    s.events.publish(evn.sortBy, item);
                }
            });

            return s;
        };

        p.build = function () {
            var s = this,
                config = s.config.getConfig("headers");

            s.headers = [];

            config.forEach(function (item) {
                var header = headerModel().setConfig(item);
                s.headers.push(header);
            });

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.events = undefined;
            s.config = undefined;

            s.headers.forEach(function (header) {
                header.destroy();
            });

            s.headers.flush();
            s.headers = undefined;

            s.groupHeaderRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.destroy();
                });
                row.flush();
            });

            s.groupHeaderRows.flush();
            s.groupHeaderRows = undefined;
            s.destroy = function () {};
        };

        return function () {
            return new GridHeaders();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgHeadersModel", [
            "rpCgHeaderModel",
            "rpCgGroupHeaderModel",
            "rpCgEventName",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-methods.js
//  Grid Methods Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridMethods() {
            var s = this;
            s.init();
        }

        var p = GridMethods.prototype;

        p.init = function () {
            var s = this;
            s.methods = {
                getTotal: s.getTotal.bind(s),
                getAverage: s.getAverage.bind(s)
            };
            return s;
        };

        // Getters

        p.getMethod = function (methodName) {
            var s = this,
                fn = s.methods[methodName];

            if (!fn) {
                fn = angular.noop;
                logc("GridMethods.getMethod: method " + methodName + " was not registered!");
            }

            return fn;
        };

        p.getTotal = function (rows, row, column) {
            var total = 0;

            rows.forEach(function (item) {
                if (item.isGroupHeader() || item.isAggregate()) {
                    return;
                }

                if (item.isSiblingOf(row) || item.isDescOf(row)) {
                    total += parseInt(item.getData()[column.getKey()], 10);
                }
            });

            return total;
        };

        p.getAverage = function (rows, row, column) {
            var count = 0,
                total = 0;

            rows.forEach(function (item) {
                if (item.isGroupHeader() || item.isAggregate()) {
                    return;
                }

                if (item.isSiblingOf(row) || item.isDescOf(row)) {
                    count++;
                    total += parseInt(item.getData()[column.getKey()], 10);
                }
            });

            return total/count;
        };

        // Actions

        p.register = function (src, methodName) {
            var s = this;

            if (s.methods[methodName]) {
                logw("GridMethods.register: " + methodName + " method is being overwritten");
            }

            if (src[methodName]) {
                s.methods[methodName] = src[methodName].bind(src);
            }
            else {
                logc("GridMethods.register: source does not have method called " + methodName);
            }

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.methods = undefined;
        };

        return function () {
            return new GridMethods();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgMethodsModel", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-row-config.js
//  Grid Row Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridRowConfig() {
            var s = this;
            s.init();
        }

        var p = GridRowConfig.prototype;

        p.init = function () {
            var s = this;
            s.config = {};
            s.baseConfig = {};
            return s;
        };

        // Setters

        p.setBaseConfig = function (config) {
            var s = this;

            s.config.base = config;
            s.maxWidth = undefined;

            config.forEach(function (item) {
                s.baseConfig[item.key] = item;
            });

            return s;
        };

        p.setConfig = function (rowType, rowConfig) {
            var s = this,
                data = [];

            rowConfig.forEach(function (item) {
                var baseConfig = s.baseConfig[item.key] || {};
                data.push(angular.extend({}, baseConfig, item));
            });

            s.config[rowType] = data;

            return s;
        };

        // Getters

        p.getConfig = function (rowType) {
            var s = this,
                config = [];

            if (rowType === undefined) {
                config = s.config.base;
            }
            else if (s.config[rowType]) {
                config = s.config[rowType];
            }
            else {
                logc("rpCgRowConfigFactory.getConfig: config for row type " + rowType + " was not defined!");
            }

            return config;
        };

        p.getLockedWidth = function () {
            var s = this,
                width = 0;

            s.config.base.forEach(function (item) {
                if (item.state.locked && item.state.active) {
                    width += item.width;
                }
            });

            return width;
        };

        p.getFreeWidth = function () {
            var s = this,
                width = 0;

            s.config.base.forEach(function (item) {
                if (!item.state.locked && item.state.active) {
                    width += item.width;
                }
            });

            return width;
        };

        p.getTotalWidth = function () {
            var s = this,
                width = 0;

            s.config.base.forEach(function (item) {
                if (item.state.active) {
                    width += item.width;
                }
            });

            return width;
        };

        p.getMaxWidth = function () {
            var s = this;

            if (s.maxWidth === undefined) {
                s.maxWidth = 0;
                s.config.base.forEach(function (item) {
                    s.maxWidth += item.width;
                });
            }

            return s.maxWidth;
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
        };

        return function () {
            return new GridRowConfig();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgRowConfigModel", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid-row.js
//  Row Model

(function (angular, undefined) {
    "use strict";

    function factory(evn, columnModel) {
        function GridRow() {
            var s = this;
            s.init();
        }

        var p = GridRow.prototype;

        p.init = function () {
            var s = this;
            s.rowData = {};
            s.columns = [];
            s.activeColumns = [];
            s.state = {
                open: true,
                hidden: false
            };
            s.classNames = "";
            return s;
        };

        // Setters

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            return s;
        };

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            return s;
        };

        p.setData = function (data) {
            var s = this,
                rowType = data.rowType || "",
                rowClass = data.rowClass || "";

            var parts = [
                rowClass,
                "rp-cg-row",
                "rp-cg-body-row",
                rowType.decamelize(),
                "level-" + data.level
            ];

            s.rowData = data;
            s.classNames = parts.join(" ");

            return s;
        };

        p.setVisibilityChecker = function (callback) {
            var s = this;
            s.elemIsVisible = callback || function () {
                return false;
            };
            return s;
        };

        // Getters

        p.getID = function () {
            var s = this;
            return s.rowData.rowID;
        };

        p.getGroupID = function () {
            var s = this;
            return s.rowData.groupID;
        };

        p.getClassNames = function () {
            var s = this;
            return s.classNames;
        };

        p.getData = function () {
            var s = this;
            return s.rowData;
        };

        p.getLevel = function () {
            var s = this;
            return s.rowData.level;
        };

        p.getColumns = function () {
            var s = this;
            return s.columns;
        };

        // Assertions

        p.hasID = function (id) {
            var s = this;
            return s.rowData.rowID == id;
        };

        p.is = function (obj) {
            var s = this;
            return s.getID() == obj.getID();
        };

        p.isAggregate = function () {
            var s = this;
            return s.rowData.rowType == "total" ||
                s.rowData.rowType == "average";
        };

        p.isChildOf = function (obj) {
            var s = this;
            return s.getLevel() == obj.getLevel() + 1 &&
                s.getGroupID() != obj.getGroupID();
        };

        p.isDescOf = function (obj) {
            var s = this;
            return s.getLevel() > obj.getLevel() &&
                s.getGroupID() != obj.getGroupID();
        };

        p.isEmpty = function () {
            var s = this;
            return s.activeColumns.length === 0;
        };

        p.isGroupHeader = function () {
            var s = this;
            return s.rowData.rowType == "groupHeader";
        };

        p.isHidden = function () {
            var s = this;
            return s.state.hidden;
        };

        p.isOpen = function () {
            var s = this;
            return s.state.open;
        };

        p.isSiblingOf = function (obj) {
            var s = this;
            return s.getLevel() == obj.getLevel() &&
                s.getGroupID() == obj.getGroupID();
        };

        p.isVisible = function () {
            var s = this;
            return s.elemIsVisible && s.elemIsVisible();
        };

        // Actions

        p.activateColumns = function () {
            var s = this;
            if (s.isEmpty()) {
                s.activeColumns = s.columns;
            }
            return s;
        };

        p.build = function () {
            var s = this,
                rowType = s.rowData.rowType,
                config = s.config.getConfig(rowType);

            s.columns.flush();

            config.forEach(function (item) {
                var column = columnModel();
                column.setEvents(s.events).setConfig(item);
                s.columns.push(column.setData(s.rowData));
            });

            return s;
        };

        p.forEachColumn = function (callback) {
            var s = this;
            s.columns.forEach(callback);
            return s;
        };

        p.open = function (bool) {
            var s = this;
            s.state.open = bool;
            return s;
        };

        p.show = function (bool) {
            var s = this;
            bool = bool === undefined ? true : bool;
            s.state.hidden = !bool;
            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        p.toggle = function () {
            var s = this;
            if (s.isGroupHeader()) {
                s.events.publish(evn.toggleRow, s);
            }
        };

        p.toggleZeroRow = function (hide) {
            var s = this,
                dataCols = 0,
                zeroDataCols = 0;

            s.columns.forEach(function (col) {
                if (col.isDataColumn()) {
                    dataCols++;

                    if (col.hasVal(0)) {
                        zeroDataCols++;
                    }
                }
            });

            s.state.zeroRow = dataCols === zeroDataCols && hide;
        };

        p.destroy = function () {
            var s = this;

            s.columns.forEach(function (column) {
                column.destroy();
            });

            s.columns.flush();

            s.state = undefined;
            s.config = undefined;
            s.events = undefined;
            s.columns = undefined;
            s.rowData = undefined;
            s.classNames = undefined;
        };

        return function () {
            return new GridRow();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgRowModel", [
            "rpCgEventName",
            "rpCgColumnModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid\js\models\grid.js
//  Complex Grid Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, timeout, eventsManager, rowModel, evn, busyModel) {
        function Grid() {
            var s = this;
            s.init();
        }

        var p = Grid.prototype;

        p.init = function () {
            var s = this,
                eventNames = Object.keys(evn);

            s.rows = [];
            s.state = {};
            s.gridData = [];
            s.rowHeightClass = "large";
            s.readyTimer = angular.noop;
            s.events = eventsManager().setEvents(eventNames);

            s.busy = s.busyModel = busyModel();
            s.events.subscribe(evn.sortBy, s.sortBy.bind(s));
            s.events.subscribe(evn.toggleRow, s.toggleRow.bind(s));
            s.events.subscribe(evn.updateVal, s.updateColumnVal.bind(s));

            return s;
        };

        // Setters

        p.setBusyState = function (bool) {
            var s = this;
            s.state.busy = bool;
            s.busyModel[bool ? "busy" : "off"]();
            return s;
        };

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            s.headers = config.getHeaders();
            s.emptyMsg = config.getEmptyMsg();
            s.headers.setEvents(s.events);
            s.columns = s.getRowConfigModel().getConfig();
            s.highlightAlternateRow = config.getAlternateRow();
            return s;
        };

        p.setData = function (gridData) {
            var s = this;

            if (gridData && gridData.push) {
                s.gridData = s.gridData.flush().concat(gridData);
                s.gridDataCopy = angular.copy(s.gridData);
                s.build();
            }
            else {
                logc("rpCgModel.setData: Invalid grid data! =>", gridData);
            }

            return s;
        };

        // Getters

        p.getFreeWidth = function () {
            var s = this;
            return s.config.getFreeWidth();
        };

        p.getLockedWidth = function () {
            var s = this;
            return s.config.getLockedWidth();
        };

        p.getMaxWidth = function () {
            var s = this;
            return s.config.getMaxWidth();
        };

        p.getRowConfigModel = function () {
            var s = this;
            return s.config.getRowConfigModel();
        };

        p.getTotalWidth = function () {
            var s = this;
            return s.config.getTotalWidth();
        };

        // Actions

        p.build = function () {
            var s = this;

            s.rows = [];

            s.gridData.forEach(function (item) {
                var row = rowModel(),
                    rowConfig = s.getRowConfigModel();
                row.setConfig(rowConfig).setData(item);
                s.rows.push(row.setEvents(s.events).build());
            });

            s.setColumnVal();

            s.readyTimer1 = timeout(s.publishDataReady.bind(s));
            s.readyTimer2 = timeout(s.publishDataReady.bind(s), 500);

            return s;
        };

        p.delaySetColumns = function () {
            var s = this;
            timeout.cancel(s.setColumnsTimer);
            s.setColumnsTimer = timeout(s.setColumns.bind(s), 100);
            return s;
        };

        p.destroyRow = function (row) {
            row.destroy();
        };

        p.edit = function (bool) {
            var s = this;
            bool = bool === undefined ? true : !!bool;
            s.state.edit = bool;
            return s;
        };

        p.flushChanges = function () {
            var s = this;
            s.setData(s.gridDataCopy);
            return s;
        };

        p.flushData = function () {
            var s = this;
            s.gridData = [];
            s.gridDataCopy = [];
            return s;
        };

        p.forEachRow = function (callback) {
            var s = this;
            s.rows.forEach(callback);
            return s;
        };

        p.publish = function () {
            var s = this;
            s.events.publish.apply(s.events, arguments);
            return s;
        };

        p.publishDataReady = function () {
            var s = this;
            s.publish(evn.dataReady);
            return s;
        };

        p.saveChanges = function () {
            var s = this;
            s.gridDataCopy = angular.copy(s.gridData);
            return s;
        };

        p.setColumns = function () {
            var s = this;

            s.rows.forEach(function (row) {
                if (row.isVisible()) {
                    row.activateColumns();
                }
            });

            return s;
        };

        p.setColumnVal = function () {
            var s = this;
            s.rows.forEach(function (row) {
                row.forEachColumn(function (column) {
                    column.setVal(column.getKeyData());
                });
            });
            return s;
        };

        p.sortBy = function (header) {
            var groupID,
                s = this,
                list = [],
                ordList = [],
                sort = $filter("orderBy"),
                reverse = header.getSortDir(),
                key = "rowData." + header.getKey();

            s.rows.forEach(function (row, index) {
                var aggregate = row.isAggregate(),
                    groupHeader = row.isGroupHeader(),
                    newGroup = groupID != row.getGroupID();

                if (newGroup || groupHeader || aggregate) {
                    groupID = row.getGroupID();

                    if (!list.empty()) {
                        list = sort(list, key, reverse);
                        ordList = ordList.concat(list);
                        list = [];
                    }

                    if (groupHeader || aggregate) {
                        ordList.push(row);
                        return;
                    }
                    else {
                        list.push(row);
                    }
                }
                else {
                    list.push(row);
                }

                if (index == s.rows.length - 1 && !list.empty()) {
                    list = sort(list, key, reverse);
                    ordList = ordList.concat(list);
                    list = [];
                }
            });

            s.rows = ordList;
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        p.toggleRow = function (row) {
            if (!row.isGroupHeader()) {
                return;
            }

            var s = this,
                skip = true,
                open = row.isOpen();

            row.open(!open);

            s.rows.forEach(function (item) {
                if (item.is(row)) {
                    skip = false;
                    return;
                }
                else if (skip) {
                    return;
                }

                var desc = item.isDescOf(row),
                    child = item.isChildOf(row),
                    sibl = item.isSiblingOf(row),
                    grpHeader = item.isGroupHeader();

                if (open && (sibl || desc)) {
                    item.show(false);

                    if (grpHeader) {
                        item.open(false);
                    }
                }
                else if (sibl || (child && grpHeader)) {
                    item.show();
                }

                if (!sibl && !desc) {
                    skip = true;
                }
            });

            s.publish(evn.updateScroll);

            s.delaySetColumns();
        };

        p.toggleZeroRows = function (bool) {
            var s = this;
            s.rows.forEach(function (row) {
                row.toggleZeroRow(bool);
            });
            s.events.publish(evn.updateColumns, 10);
        };

        p.updateColumnVal = function () {
            var s = this;
            s.rows.forEach(function (row) {
                row.forEachColumn(function (column) {
                    var methodName = column.getMethodName();

                    if (methodName) {
                        var method = s.config.getMethod(methodName);
                        column.setVal(method(s.rows, row, column));
                    }
                    else {
                        column.setVal(column.getKeyData());
                    }
                });
            });
            return s;
        };

        p.destroy = function () {
            var s = this;

            s.rows.forEach(s.destroyRow);
            timeout.cancel(s.readyTimer1);
            timeout.cancel(s.readyTimer2);
            timeout.cancel(s.setColumnsTimer);

            s.rows.flush();
            s.events.destroy();
            s.config.destroy();
            s.gridData.flush();
            s.headers.destroy();
            s.rows = undefined;
            s.config = undefined;
            s.headers = undefined;
            s.gridData = undefined;
            s.emptyMsg = undefined;
        };

        return function () {
            return new Grid();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgModel", [
            "$filter",
            "timeout",
            "eventsManager",
            "rpCgRowModel",
            "rpCgEventName",
            "rpBusyIndicatorModel",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\complex-grid\js\services\grid-group-headers.js
//  Complex Grid Group Headers Service

(function (angular) {
    "use strict";

    function CgGroupHeadersSvc() {
        var svc = this;

        svc.updateLocked = function (rows) {
            rows.forEach(function (columns) {
                columns.forEach(function (column) {
                    column.locked = column.state.locked;
                    delete column.state;
                });
            });

            return rows;
        };

        svc.getStates = function (columns) {
            var states = [];

            columns.forEach(function (column) {
                states.push(column.state);
            });

            return states;
        };

        svc.assemble = function (columnsList, groupHeaderRows) {
            var prevIndex = 0,
                rows = svc.updateLocked(groupHeaderRows);

            rows.forEach(function (columns) {
                var prevIndex = 0;

                columns.forEach(function (column) {
                    var colspan = parseInt(column.colspan, 10),
                        subColumns = columnsList.slice(prevIndex, prevIndex + colspan);

                    prevIndex += colspan;
                    delete column.colspan;
                    column.subColumnStates = svc.getStates(subColumns);
                });

                prevIndex = 0;
            });
        };
    }

    angular
        .module("rpComplexGrid")
        .service("rpCgGroupHeadersSvc", [CgGroupHeadersSvc]);
})(angular);

