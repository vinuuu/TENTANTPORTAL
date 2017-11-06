//  Source: _lib\realpage\grid\js\_bundle.inc
angular.module("rpGrid", []);

//  Source: _lib\realpage\grid\js\directives\grid-cell.js
//  Grid Cell Directive

(function (angular, undefined) {
    "use strict";

    function rpGridCell($templateCache, $compile) {
        function link(scope, elem, attr) {
            var child,
                column,
                dir = {},
                childHtml;

            dir.init = function () {
                var custom = scope.config &&
                    scope.config.type !== undefined &&
                    scope.config.type == 'custom';

                if (custom) {
                    childHtml = $templateCache.get(scope.config.templateUrl);
                    child = angular.element(childHtml);

                    child = $compile(child)(scope);
                    elem.html("").append(child);
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.html("").remove();
                dir = undefined;
                elem = undefined;
                scope = undefined;
                child = undefined;
                childHtml = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'C'
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridCell', ['$templateCache', '$compile', rpGridCell]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-datetimepicker-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridDatetimepickerFilter($timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                filter = scope.model,
                config = filter.getConfig(),
                datetimepicker = config.datetimepicker;

            dir.init = function () {
                datetimepicker.setConfig("size", "small");
                datetimepicker.setConfig("onChange", dir.onChange);

                scope.filter = dir;
                dir.config = datetimepicker;

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.onChange = function (data) {
                $timeout(filter.activate.bind(filter), 10);
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                filter = undefined;
                config = undefined;
                scope.filter = undefined;
                scope = undefined;
                datetimepicker = undefined;
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
            templateUrl: "realpage/grid/templates/grid-datetimepicker-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridDatetimepickerFilter", [
            "$timeout",
            rpGridDatetimepickerFilter
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-filters.js
//  Grid Filters Directive

(function (angular) {
    "use strict";

    function rpGridFilters() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/grid/templates/grid-filters.html"
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridFilters', [rpGridFilters]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-header-tooltip.js
//  Grid Header Tooltip Directive

(function (angular, undefined) {
    "use strict";

    function rpGridHeaderTooltip($cache, $compile, timeout) {
        var inst = 1;

        function link(scope, elem, attr) {
            var dir = {},
                tooltipHtml,
                tooltipElem,
                tooltipWrap,
                body = angular.element("body"),
                config = scope.header.getConfig(),
                click = "click.rpGridHeaderTooltip" + inst++;

            dir.init = function () {
                dir.getContent();
                dir.isVisible = false;
                scope.gridHeaderTooltip = dir;
                dir.destWatch = scope.$on("destroy", dir.destroy);
            };

            dir.toggleTooltip = function () {
                dir.isVisible = !dir.isVisible;

                body.off(click);

                if (dir.isVisible) {
                    dir.hideTimer = timeout(function () {
                        body.one(click, dir.hideTooltip);
                    }, 100);
                }
            };

            dir.hideTooltip = function () {
                scope.$apply(function () {
                    dir.isVisible = false;
                });
            };

            dir.getContent = function () {
                if (config.tooltipUrl) {
                    tooltipHtml = $cache.get(config.tooltipUrl);
                    tooltipElem = angular.element(tooltipHtml);
                    tooltipWrap = elem.find(".rp-grid-header-tooltip-content");

                    tooltipElem = $compile(tooltipElem)(scope);
                    tooltipWrap.html("").append(tooltipElem);
                }
            };

            dir.destroy = function () {
                body.off(click);
                dir.destWatch();
                tooltipWrap.html("");
                tooltipElem.remove();
                timeout.cancel(dir.hideTimer);

                dir = undefined;
                body = undefined;
                elem = undefined;
                click = undefined;
                config = undefined;
                tooltipElem = undefined;
                tooltipHtml = undefined;
                tooltipWrap = undefined;
                scope.gridHeaderTooltip = undefined;
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
        .module("rpGrid")
        .directive("rpGridHeaderTooltip", [
            "$templateCache",
            "$compile",
            "timeout",
            rpGridHeaderTooltip
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-header.js
//  Grid Header Directive

(function (angular, undefined) {
    "use strict";

    function rpGridHeader($cache, $compile) {
        function link(scope, elem, attr) {
            var dir = {},
                config = scope.header.config;

            dir.init = function () {
                if (config.type == "custom") {
                    dir.childHtml = $cache.get(config.templateUrl);
                    dir.child = angular.element(dir.childHtml);

                    dir.child = $compile(dir.child)(scope);
                    elem.html("").append(dir.child);
                }

                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.destroy = function () {
                dir.destWatch();
                elem.html("").remove();
                dir = undefined;
                elem = undefined;
                scope = undefined;
                config = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: "C"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridHeader", ["$templateCache", "$compile", rpGridHeader]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-headers.js
//  Grid Headers Directive

(function (angular) {
    "use strict";

    function rpGridHeaders() {
        function link(scope, elem, attr) {}

        return {
            scope: {
                model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "realpage/grid/templates/grid-headers.html"
        };
    }

    angular
        .module("rpGrid")
        .directive('rpGridHeaders', [rpGridHeaders]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-text-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridTextFilter(inputText) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.config = dir.getConfig();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getConfig = function () {
                dir.configData = scope.model.getConfig();

                angular.extend(dir.configData, {
                    size: "small",
                    onChange: dir.onChange
                });

                return inputText(dir.configData);
            };

            dir.onChange = function (data) {
                scope.model.activate();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope.model = undefined;
                scope.config = undefined;
                scope = undefined;
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
            templateUrl: "realpage/grid/templates/grid-text-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridTextFilter", ["rpFormInputTextConfig", rpGridTextFilter]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid-menu-filter.js
//  Grid Date Time Picker Directive

(function (angular, undefined) {
    "use strict";

    function rpGridMenuFilter(selectMenu) {
        function link(scope, elem, attr) {
            var dir = {};

            dir.init = function () {
                scope.config = dir.getConfig();
                dir.destWatch = scope.$on("$destroy", dir.destroy);
            };

            dir.getConfig = function () {
                dir.configData = scope.model.getConfig();

                angular.extend(dir.configData, {
                    size: "small",
                    onChange: dir.onChange
                });

                return selectMenu(dir.configData);
            };

            dir.onChange = function (data) {
                scope.model.activate();
            };

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                scope.model = undefined;
                scope.config = undefined;
                scope = undefined;
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
            templateUrl: "realpage/grid/templates/grid-menu-filter.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridMenuFilter", ["rpFormSelectMenuConfig", rpGridMenuFilter]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\grid.js
//  Grid Directive

(function (angular, undefined) {
    "use strict";

    function rpGrid(timeout) {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                if (dir.modelIsValid()) {
                    dir.destWatch = scope.$on("$destroy", dir.destroy);
                    dir.readyWatch = model.subscribe("ready", dir.onReady);
                }
                else {
                    logw("Directive.rpGrid.init: model is invalid! => ", model);
                }
            };

            dir.modelIsValid = function () {
                return model && model.hasName && model.hasName("GridModel");
            };

            dir.onReady = function () {
                dir.timer = timeout(dir.setVis);
            };

            dir.setVis = function () {
                if (scope.floatScroll) {
                    scope.floatScroll.setVis().setSize();
                }
                else {
                    logc("rpGrid.setVis: FloatScroll module is missing!");
                }
            };

            dir.destroy = function () {
                dir.destWatch();
                dir.readyWatch();
                timeout.cancel(dir.timer);
                dir.destroy = angular.noop;
                dir = undefined;
                model = undefined;
                scope.model = undefined;
                scope = undefined;
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
            templateUrl: "realpage/grid/templates/grid.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGrid", ["timeout", rpGrid]);
})(angular);

//  Source: _lib\realpage\grid\js\directives\track-selection.js
//  Track Selection Directive

(function (angular, undefined) {
    "use strict";

    function rpTrackSelection(watchList) {
        function link(scope, elem, attr) {
            var dir = {},
                firstPass = true;

            dir.init = function () {
                scope.trackSelection = dir;
                dir.watchList = watchList();
                dir.watchList.add(scope.$watch(dir.getValue, dir.onChange));
                dir.watchList.add(scope.$on('$destroy', dir.destroy));
            };

            dir.getId = function () {
                return scope.$eval(attr.rpTrackSelectionId);
            };

            dir.getManager = function () {
                return scope.$eval(attr.rpSelectionManager);
            };

            dir.getValue = function () {
                return scope.$eval(attr.rpTrackSelection);
            };

            dir.onChange = function (bool) {
                if (firstPass) {
                    firstPass = false;
                    dir.defVal = bool;
                }
                else {
                    dir.recordChange(bool);
                }
            };

            dir.recordChange = function (bool) {
                var method,
                    id = dir.getId();

                if (bool === dir.defVal) {
                    method = 'remove' + (bool ? 'Deselected' : 'Selected');
                    dir.getManager()[method](id);
                }
                else {
                    method = 'add' + (bool ? 'Selected' : 'Deselected');
                    dir.getManager()[method](id);
                }
            };

            dir.destroy = function () {
                dir.watchList.destroy();
                dir = undefined;
                attr = undefined;
                firstPass = undefined;
                scope.trackSelection = undefined;
                scope = undefined;
            };

            dir.init();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    angular
        .module("rpGrid")
        .directive('rpTrackSelection', ['rpWatchList', rpTrackSelection]);
})(angular);


//  Source: _lib\realpage\grid\js\models\grid-actions.js
//  Grid Actions Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridActions() {
            var s = this;
            s.init();
        }

        var p = GridActions.prototype;

        p.init = function () {
            var s = this;
            s.src = {};
            return s;
        };

        p.setSrc = function (src) {
            var s = this;
            s.src = src;
            return s;
        };

        p.getMethod = function (name) {
            var s = this;

            return function (record) {
                if (!s.src) {
                    logc("GridActions: Method source has not been defined!");
                    return angular.noop;
                }
                else if (!s.src[name]) {
                    logc("GridActions: Method " + name + " has not been defined!");
                    return angular.noop;
                }
                else {
                    return s.src[name](record);
                }
            };
        };

        p.destroy = function () {
            var s = this;
            s.src = undefined;
        };

        return function () {
            return new GridActions();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridActions", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-config.js
//  Grid Config Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        var inst = 1;

        function GridConfig() {
            var s = this;
            s._id = inst++;
            s._name = "GridConfig";
            s.init();
        }

        var p = GridConfig.prototype;

        p.init = function () {
            var s = this;
            s.src = {};
            return s;
        };

        // Setters

        p.setSrc = function (src) {
            var s = this;
            s.src = src;
            return s;
        };

        // Getters

        p.get = function () {
            return [];
        };

        p.getFilters = function () {
            return [];
        };

        p.getGroupHeaders = function () {
            return [];
        };

        p.getHeaders = function () {
            return [];
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        p.getMethod = function (name) {
            var s = this;

            return function () {
                if (!s.src) {
                    logc("GridConfig.getMethod: Method source has not been defined!");
                }
                else if (!s.src[name]) {
                    logc("GridConfig.getMethod: Method name " + name + " has not been defined!");
                }
                else {
                    var method = s.src[name];
                    return method.apply(s.src, arguments);
                }
            };
        };

        // Assertions

        p.hasName = function (name) {
            var s = this;
            return s._name == name;
        };

        p.destroy = function () {
            var s = this;
            s.src = undefined;
            s.get = undefined;
            s.getMethod = undefined;
            s.getHeaders = undefined;
            s.getFilters = undefined;
        };

        return function () {
            return new GridConfig();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridConfig", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-filter.js
//  Grid Filter Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream, timeout, formatter) {
        function GridFilterModel() {
            var s = this;
            s.init();
        }

        var p = GridFilterModel.prototype;

        p.init = function () {
            var s = this;
            s.events = {
                activate: eventStream()
            };
            return s;
        };

        // Setters

        p.setConfig = function (data) {
            var s = this;
            s.config = data;
            s.key = data.key;
            s._defaultValue = data.value || "";
            s.delayFiltering = data.type == "text";
            return s;
        };

        p.setValue = function (value) {
            var s = this;
            s.config.value = value;
            return s;
        };

        // Getters

        p.getConfig = function () {
            var s = this;
            return s.config;
        };

        p.getKey = function () {
            var s = this;
            return s.key;
        };

        p.getRawValue = function () {
            var s = this;
            return s.config.value;
        };

        p.getValue = function () {
            var s = this;

            if (!formatter[s.config.type]) {
                return s.config.value;
            }

            return formatter[s.config.type](s);
        };

        p.getCustomFilter = function () {
            var s = this;
            return s.config.customFilter;
        };

        // Assertions

        p.hasKey = function (key) {
            var s = this;
            return s.key == key;
        };

        p.isEmpty = function () {
            var s = this;
            return !s.config || s.config.value === "" || s.config.value === undefined;
        };

        p.hasCustomFilter = function () {
            var s = this;
            return s.config.customFilter !== undefined;
        };

        // Actions

        p.activate = function () {
            var s = this;
            if (s.delayFiltering) {
                timeout.cancel(s.timer);
                var delay = s.config.filterDelay,
                    dt = delay === undefined ? 400 : delay;
                s.timer = timeout(s.publish.bind(s), dt);
            }
            else {
                s.publish();
            }
            return s;
        };

        p.filterBy = function () {
            var s = this;
            return {
                key: s.key,
                value: s.config.value
            };
        };

        p.publish = function () {
            var s = this;
            s.events.activate.publish(s);
        };

        p.reset = function () {
            var s = this;
            s.config.value = s._defaultValue;
            return s;
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events[eventName].subscribe(callback);
        };

        p.destroy = function () {
            var s = this;
            timeout.cancel(s.timer);
            s.events.activate.destroy();
            s.config = undefined;
            s.events = undefined;
        };

        return function () {
            return new GridFilterModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridFilterModel", [
            "eventStream",
            "timeout",
            "rpGridFilterFormatter",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-filters.js
//  Grid Filters Model

(function (angular, undefined) {
    "use strict";

    function factory(gridFilter) {
        var inst = 1;

        function GridFiltersModel() {
            var s = this;
            s._id = inst++;
            s.init();
        }

        var p = GridFiltersModel.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.filters = {};
            s.filterData = {};
            s.state = {
                active: false
            };
            return s;
        };

        // Setters

        p.setClassNames = function (classNames) {
            var s = this;
            s.classNames = classNames;
            return s;
        };

        p.setConfig = function (config) {
            var s = this;

            s.list.flush();
            s.filterData = {};

            config.forEach(function (data) {
                var filter = gridFilter().setConfig(data);
                filter.subscribe("activate", s.activate.bind(s));
                s.list.push(filter);
                s.filters[data.key] = filter;
                filter = undefined;
            });

            return s;
        };

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            return s;
        };

        p.setFilterValue = function (key, value) {
            var s = this;

            s.list.forEach(function (filter) {
                if (filter.hasKey(key)) {
                    filter.setValue(value);
                }
            });

            return s;
        };

        p.setState = function (state) {
            var s = this;
            s.state = state;
            return s;
        };

        // Getters

        p.getFilterByKey = function (key) {
            var s = this;

            if (s.filters[key] === undefined) {
                logw("rpGridFiltersModel.getFilterByKey: Filter with key " + key + " does not exist!");
            }

            return s.filters[key];
        };

        p.getFilterData = function () {
            var s = this;

            s.list.forEach(function (filter) {
                var key = filter.getKey();

                if (filter.isEmpty()) {
                    delete s.filterData[key];
                }
                else {
                    s.filterData[key] = filter.getValue();
                }
            });

            return s.filterData;
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        // Actions

        p.activate = function () {
            var s = this;
            s.events.publish("filterBy", s.getFilterData());
            return s;
        };

        p.reset = function () {
            var s = this;

            s.list.forEach(function (filter) {
                filter.reset();
            });

            s.list[0].activate();

            return s;
        };

        p.toggle = function () {
            var s = this;
            s.state.active = !s.state.active;
            return s;
        };

        // Assertions

        p.filterExists = function (filterKey) {
            var s = this,
                exists = !!s.filters[filterKey];

            if (!exists) {
                logw("GridFiltersModel: filter by key %s does not exist", filterKey);
            }

            return exists;
        };

        p.destroy = function () {
            var s = this;

            s.list.forEach(function (filter) {
                filter.destroy();
            });
            s.list.flush();

            s.list = undefined;
            s.state = undefined;
            s.events = undefined;
            s.filters = undefined;
            return s;
        };

        return function () {
            return new GridFiltersModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridFiltersModel", ["rpGridFilterModel", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-group-header.js
//  Grid Group Header Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridGroupHeader() {
            var s = this;
            s.init();
        }

        var p = GridGroupHeader.prototype;

        p.init = function () {
            var s = this;
            s.classData = undefined;
            s.config = {
                colSpan: 1,
                classNames: "",
                lineThrough: false
            };
        };

        p.setConfig = function (config) {
            var s = this;
            angular.extend(s.config, config);
            return s;
        };

        p.getClass = function () {
            var s = this;

            if (s.classData === undefined) {
                s.classData = {
                    line: s.config.colSpan > 1
                };
            }

            return s.classData;
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
            s.classData = undefined;
        };

        return function (config) {
            return (new GridGroupHeader()).setConfig(config);
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridGroupHeaderModel", [factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-header.js
//  Grid Header Model

(function (angular, undefined) {
    "use strict";

    function factory(eventStream) {
        function GridHeaderModel() {
            var s = this;
            s.init();
        }

        var p = GridHeaderModel.prototype;

        p.init = function () {
            var s = this;
            s.state = {};
            s.events = {
                activate: eventStream()
            };
            return s;
        };

        p.setConfig = function (data) {
            var s = this;
            s.config = data;
            s.key = data.key;
            s.state = {
                active: false,
                reverse: false,
                sortable: data && data.isSortable
            };

            s.hasTooltip = data.tooltipContent !== undefined;

            return s;
        };

        p.getConfig = function () {
            var s = this;
            return s.config;
        };

        p.activate = function () {
            var s = this;

            if (!s.state.sortable) {
                return;
            }
            else if (!s.state.active) {
                s.state.active = true;
            }
            else {
                s.state.reverse = !s.state.reverse;
            }

            s.events.activate.publish(s);

            return s;
        };

        p.hasKey = function (key) {
            var s = this;
            return s.key == key;
        };

        p.is = function (item) {
            var s = this;
            return item.hasKey(s.key);
        };

        p.deactivate = function () {
            var s = this;
            angular.extend(s.state, {
                active: false,
                reverse: false
            });
            return s;
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events[eventName].subscribe(callback);
        };

        p.sortBy = function () {
            var obj = {},
                s = this;
            obj[s.key] = s.state.reverse ? "DESC" : "ASC";
            return obj;
        };

        p.isActive = function () {
            var s = this;
            return s.state.active;
        };

        p.destroy = function () {
            var s = this;
            s.events.activate.destroy();
            s.state = undefined;
            s.events = undefined;
            s.config = undefined;
        };

        return function (config) {
            return (new GridHeaderModel()).setConfig(config);
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridHeaderModel", ["eventStream", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-headers.js
//  Grid Headers Model

(function (angular, undefined) {
    "use strict";

    function factory(gridHeader, gridGroupHeader, gridSelectModel) {
        function GridHeadersModel() {
            var s = this;
            s.init();
        }

        var p = GridHeadersModel.prototype;

        p.init = function () {
            var s = this;
            s.sortBy = {};
            s.headerRows = [];
            s.groupHeaderRows = [];
            s.selectModel = gridSelectModel();
            return s;
        };

        // Setters

        p.setEvents = function (events) {
            var s = this;
            s.events = events;
            s.selectModel.setEvents(events);
            return s;
        };

        p.setClassNames = function (classNames) {
            var s = this;
            s.classNames = classNames;
            return s;
        };

        p.setHeaders = function (rows) {
            var s = this;

            s.sortBy = {};
            s.headerRows.flush();

            rows.forEach(function (row) {
                var headerRow = [];

                row.forEach(function (config) {
                    var header = gridHeader(config);
                    header.subscribe("activate", s.activate.bind(s));
                    headerRow.push(header);
                });

                s.headerRows.push(headerRow);
            });

            return s;
        };

        p.setGroupHeaders = function (rows) {
            var s = this;

            s.groupHeaderRows.flush();

            rows.forEach(function (row) {
                var groupHeaderRow = [];

                row.forEach(function (config) {
                    groupHeaderRow.push(gridGroupHeader(config));
                });

                s.groupHeaderRows.push(groupHeaderRow);
            });

            return s;
        };

        // Getters

        p.getSortData = function () {
            var s = this;
            return s.sortBy;
        };

        // Actions

        p.activate = function (header) {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (item) {
                    if (!item.is(header)) {
                        item.deactivate();
                    }
                });
            });

            s.sortBy = header.sortBy();
            s.events.publish("sortBy", s.sortBy);

            return s;
        };

        p.publishState = function () {
            var s = this;
            s.selectModel.publishState();
            return s;
        };

        p.reset = function () {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.deactivate();
                });
            });

            return s;
        };

        p.updateSelected = function (checked) {
            var s = this;
            s.selectModel.updateSelected(checked);
            return s;
        };

        p.destroy = function () {
            var s = this;

            s.headerRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.destroy();
                });
                row.flush();
            });

            s.headerRows.flush();
            s.headerRows = undefined;

            s.groupHeaderRows.forEach(function (row) {
                row.forEach(function (header) {
                    header.destroy();
                });
                row.flush();
            });

            s.groupHeaderRows.flush();
            s.groupHeaderRows = undefined;

            s.sortBy = undefined;
            s.events = undefined;

            return s;
        };

        return function () {
            return new GridHeadersModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridHeadersModel", [
            "rpGridHeaderModel",
            "rpGridGroupHeaderModel",
            "rpGridSelectModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid-transform.js
//  Grid Transform Service

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function GridTransform() {
            var s = this;
            s.init();
        }

        var p = GridTransform.prototype;

        p.init = function () {
            var s = this;
            return s;
        };

        p.watch = function (grid) {
            var s = this;
            s.grid = grid;
            grid.subscribe("sortBy", s.sort.bind(s));
            grid.subscribe("filterBy", s.filter.bind(s));
            return s;
        };

        p.filter = function (filterBy) {
            var s = this;

            if (s.gridData === undefined) {
                s.gridData = [].concat(s.grid.getData().records);
            }

            var records = $filter("filter")(s.gridData, filterBy);

            if (s.sortBy) {
                records = s.sortData(records, s.sortBy);
            }

            s.grid.flushData().setData({
                records: records
            });

            return s;
        };

        p.sort = function (sortBy) {
            var s = this,
                records = s.grid.getData().records;

            s.sortBy = sortBy;
            records = s.sortData(records, sortBy);

            s.grid.flushData().setData({
                records: records
            });
            return s;
        };

        p.sortData = function (records, sortBy) {
            var s = this,
                key = Object.keys(sortBy)[0],
                reverse = sortBy[key] != "ASC";

            return $filter("naturalSort")(records, key, reverse);
        };

        p.reset = function () {
            var s = this;
            s.sortBy = undefined;
            s.gridData = undefined;
            return s;
        };

        p.destroy = function () {
            var s = this;
            s.reset();
            s.grid = undefined;
            s.gridData = undefined;
        };

        return function () {
            return new GridTransform();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridTransform", ["$filter", factory]);
})(angular);

//  Source: _lib\realpage\grid\js\models\grid.js
//  Grid Model

(function (angular, undefined) {
    "use strict";

    function factory(busyModel, paginationModel, headersModel, filtersModel, eventsManager, selectionManager) {
        var inst = 1;

        function GridModel() {
            var s = this;
            s._id = inst++;
            s._name = "GridModel";
            s.init();
        }

        var p = GridModel.prototype;

        p.init = function () {
            var s = this,
                eventNames = [
                    "ready",
                    "sortBy",
                    "select",
                    "filterBy",
                    "paginate",
                    "selectAll",
                    "selectChange"
                ];

            s.data = {
                records: []
            };

            s.state = {};
            s.emptyMsg = "";
            s.busyModel = busyModel();
            s.events = eventsManager();
            s.headersModel = headersModel();
            s.filtersModel = filtersModel();
            s.paginationModel = paginationModel();
            s.selectionManager = selectionManager();

            s.events.setEvents(eventNames);

            s.headersModel.setEvents(s.events);
            s.filtersModel.setEvents(s.events);

            s.paginationModel.setEvents({
                update: s.events.getEvent("paginate")
            });

            s.events.subscribe("sortBy", s.setSortBy.bind(s));
            s.events.subscribe("select", s.selectAll.bind(s));
            s.events.subscribe("filterBy", s.setFilterBy.bind(s));

            return s;
        };

        // Getters

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getEvents = function () {
            var s = this;
            return s.events;
        };

        p.getFilterByKey = function (key) {
            var s = this;
            return s.filtersModel.getFilterByKey(key);
        };

        p.getFilterData = function () {
            var s = this;
            return s.filtersModel.getFilterData();
        };

        p.getID = function () {
            var s = this;
            return s._id;
        };

        p.getQuery = function () {
            var s = this;
            return s.paginationModel.getQuery();
        };

        p.getSelectionChanges = function () {
            var s = this;
            return s.selectionManager.getChanges();
        };

        p.getSelectKey = function () {
            var key = "",
                s = this;

            s.config.forEach(function (item) {
                if (item.type == "select") {
                    key = item.key;
                }
            });

            return key;
        };

        // Setters

        p.setConfig = function (cfg) {
            var s = this;

            if (s.isValidConfig(cfg)) {
                s.config = cfg.get();
                s.filtersModel.setConfig(cfg.getFilters());
                s.headersModel
                    .setHeaders(cfg.getHeaders())
                    .setGroupHeaders(cfg.getGroupHeaders());
                var filterBy = s.filtersModel.getFilterData();
                s.paginationModel.setFilterBy(filterBy);
            }
            else {
                logc("Model.rpGridModel.setConfig: config is not valid! => ", cfg);
            }

            return s;
        };

        p.setData = function (data) {
            var s = this;
            data.records = data.records || [];
            s.data = data;
            s.updateSelected();
            s.paginationModel.reset().updateState(data.totalRecords);
            s.events.publish("ready");
            return s;
        };

        p.setEmptyMsg = function (msg) {
            var s = this;
            s.emptyMsg = msg;
            return s;
        };

        p.setFilterBy = function (filterBy) {
            var s = this;
            s.paginationModel.setFilterBy(filterBy);
            return s;
        };

        p.setFiltersClassNames = function (classNames) {
            var s = this;
            s.filtersModel.setClassNames(classNames);
            return s;
        };

        p.setFilterState = function (state) {
            var s = this;
            s.filtersModel.setState(state);
            return s;
        };

        p.setFilterValue = function (key, val) {
            var s = this;
            s.filtersModel.setFilterValue(key, val);
            s.paginationModel.setFilterValue(key, val);
            return s;
        };

        p.setGridSelectModel = function (gridSelectModel) {
            var s = this;
            s.gridSelectModel = gridSelectModel;
            return s;
        };

        p.setHeadersClassNames = function (classNames) {
            var s = this;
            s.headersModel.setClassNames(classNames);
            return s;
        };

        p.setResultsPerPage = function (count) {
            var s = this;
            s.paginationModel.setResultsPerPage(count);
            return s;
        };

        p.setSortBy = function (sortBy) {
            var s = this;
            s.paginationModel.setSortBy(sortBy);
            return s;
        };

        p.setSortValue = function (key, val) {
            var s = this;
            s.paginationModel.setSortValue(key, val);
            return s;
        };

        // Assertions

        p.filterExists = function (filterKey) {
            var s = this;
            return s.filtersModel.filterExists(filterKey);
        };

        p.hasName = function (name) {
            var s = this;
            return s._name == name;
        };

        p.hasSelectionChanges = function () {
            var s = this;
            return s.selectionManager.hasChanges();
        };

        p.isValidConfig = function (config) {
            var s = this;
            return config && config.hasName && config.hasName("GridConfig");
        };

        // Actions

        p.addData = function (data) {
            var s = this;
            data.records = data.records || [];
            s.data.records = s.data.records.concat(data.records);
            s.updateSelected();
            s.paginationModel.updateState(data.totalRecords);
            s.events.publish("ready");
            return s;
        };

        p.busy = function (bool) {
            var s = this;
            s.state.busy = bool;
            s.busyModel[bool ? 'busy' : 'off']();
            return s;
        };

        p.clearSortValue = function () {
            var s = this;
            s.paginationModel.clearSortValue();
            return s;
        };

        p.deleteRow = function (idKey, row) {
            var s = this;
            s.data.records = s.data.records.filter(function (item) {
                return item[idKey] != row[idKey];
            });

            s.paginationModel.setCurrent(s.paginationModel.getCurrent() - 1);

            return s;
        };

        p.flushData = function () {
            var s = this;
            s.selectionManager.reset();
            s.paginationModel.reset();
            s.data.records.flush();
            return s;
        };

        p.resetFilters = function () {
            var s = this;
            s.filtersModel.reset();
            return s;
        };

        p.selectAll = function (bool) {
            var s = this,
                key = s.getSelectKey();

            s.data.records.forEach(function (item) {
                if (item.disableSelection !== true) {
                    item[key] = bool;
                }
            });

            s.events.publish("selectAll", bool);
        };

        p.subscribe = function (eventName, callback) {
            var s = this;
            return s.events.subscribe(eventName, callback);
        };

        p.toggleFilters = function () {
            var s = this;
            s.filtersModel.toggle();
            return s;
        };

        p.updateSelected = function () {
            var s = this;

            if (s.events) {
                s.events.publish("selectChange");
            }

            var count = 0,
                selCount = 0,
                checked = false,
                list = s.data.records,
                key = s.getSelectKey();

            list.forEach(function (item) {
                if (item.disableSelection !== true) {
                    count++;
                    selCount += item[key] ? 1 : 0;
                }
            });

            checked = (count > 0) && (count === selCount);

            if (s.gridSelectModel) {
                s.gridSelectModel.updateSelected(checked);
            }

            s.headersModel.updateSelected(checked);
        };

        p.destroy = function () {
            var s = this;
            s.events.destroy();
            s.busyModel.destroy();
            s.headersModel.destroy();
            s.filtersModel.destroy();
            s.paginationModel.destroy();
            s.selectionManager.destroy();

            if (s.gridSelectModel) {
                s.gridSelectModel.destroy();
            }

            s.data = undefined;
            s.state = undefined;
            s.config = undefined;
            s.events = undefined;
            s.busyModel = undefined;
            s.headersModel = undefined;
            s.filtersModel = undefined;
            s.paginationModel = undefined;
            s.selectionManager = undefined;
        };

        return function () {
            return new GridModel();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridModel", [
            "rpBusyIndicatorModel",
            "rpPaginationModel",
            "rpGridHeadersModel",
            "rpGridFiltersModel",
            "eventsManager",
            "rpSelectionManager",
            factory
        ]);
})(angular);


//  Source: _lib\realpage\grid\js\services\filter-formatter.js
//  Grid Filter Formatter Service

(function (angular, undefined) {
    "use strict";

    function GridFilterFormatter() {
        var svc = this;

        svc.datetimepicker = function (filter) {
            var data = filter.getRawValue(),
                config = filter.getConfig();

            if (!data) {
                data = "%";
            }
            else if (config.publishFormat) {
                data = data.format(config.publishFormat);
            }

            if (config.formatter && typeof config.formatter == "function") {
                data = config.formatter(data);
            }

            return data;
        };
    }

    angular
        .module("rpGrid")
        .service("rpGridFilterFormatter", [
            GridFilterFormatter
        ]);
})(angular);


//  Source: _lib\realpage\grid\js\templates\templates.inc.js
angular.module("rpGrid").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/grid/templates/grid-datetimepicker-filter.html",
"<div class=\"rp-grid-datetimepicker-filter\"><rp-datetimepicker ng-if=\"filter.config\" config=\"filter.config\" rp-model=\"model.config.value\"></rp-datetimepicker></div>");
$templateCache.put("realpage/grid/templates/grid-filters.html",
"<table ng-class=\"model.state\" class=\"{{model.classNames || 'rp-grid-filters-1'}}\"><tr class=\"rp-grid-row\"><td ng-switch=\"filter.config.type\" ng-repeat=\"filter in model.list\" class=\"rp-grid-cell {{::filter.key.decamelize()}} {{::filter.config.classNames}}\"><rp-grid-menu-filter model=\"filter\" ng-switch-when=\"menu\"></rp-grid-menu-filter><rp-grid-text-filter model=\"filter\" ng-switch-when=\"text\"></rp-grid-text-filter><rp-grid-datetimepicker-filter model=\"filter\" ng-switch-when=\"datetimepicker\"></rp-grid-datetimepicker-filter></td></tr></table>");
$templateCache.put("realpage/grid/templates/grid-headers.html",
"<table class=\"{{model.classNames || 'rp-grid-headers-1'}} ft-form\"><tr class=\"rp-grid-row rp-grid-group-header-row\" ng-repeat=\"groupHeaders in model.groupHeaderRows\"><td ng-class=\"groupHeader.getClass()\" ng-repeat=\"groupHeader in groupHeaders\" colspan=\"{{::groupHeader.config.colSpan}}\" class=\"rp-grid-cell rp-grid-group-header-cell {{groupheader.config.classNames}}\"><div class=\"rp-grid-group-header-cell-content\"><span class=\"rp-grid-group-header-cell-text\">{{::groupHeader.config.text}}</span></div></td></tr><tr class=\"rp-grid-row\" ng-repeat=\"row in model.headerRows\"><td ng-repeat=\"header in row\" ng-switch=\"header.config.type\" class=\"rp-grid-cell rp-grid-header {{::header.key.decamelize()}} {{::header.config.classNames}}\"><label ng-switch-when=\"select\" ng-class=\"{active: header.config.enabled}\" class=\"md-check dark-bluebox rp-grid-header-checkbox\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"rp-form-checkbox\" ng-model=\"model.selectModel.selected\" ng-change=\"model.selectModel.publishState()\"> <i class=\"primary\"></i></label><span ng-switch-default class=\"rp-grid-text\" ng-class=\"header.state\" ng-click=\"header.activate()\">{{::header.config.text}} </span><i ng-switch-default ng-class=\"header.state\" class=\"rp-grid-header-icon\" ng-click=\"header.activate()\"></i><div ng-if=\"header.hasTooltip\" class=\"rp-grid-header-tooltip {{::header.config.tooltipClass}}\"><span ng-click=\"gridHeaderTooltip.toggleTooltip()\" class=\"rp-grid-header-tooltip-icon {{::header.config.tooltipIcon}}\"></span><div ng-show=\"gridHeaderTooltip.isVisible\" class=\"fdn-arrow box-color text-color rp-grid-header-tooltip-content-wrap\"><span class=\"arrow left white rp-grid-header-tooltip-content-arrow\"></span><div class=\"box-body rp-grid-header-tooltip-content\">{{::header.config.tooltipContent}}</div></div></div></td></tr></table>");
$templateCache.put("realpage/grid/templates/grid-menu-filter.html",
"<div class=\"rp-grid-menu-filter\"><rp-form-select-menu ng-if=\"config\" config=\"config\" rp-model=\"model.config.value\"></rp-form-select-menu></div>");
$templateCache.put("realpage/grid/templates/grid-text-filter.html",
"<div class=\"rp-grid-text-filter\"><rp-form-input-text ng-if=\"config\" config=\"config\" rp-model=\"model.config.value\"></rp-form-input-text></div>");
$templateCache.put("realpage/grid/templates/grid.html",
"<div class=\"rp-grid-wrap rp-float-scroll\" ng-class=\"model.state\"><div class=\"rp-grid\"><rp-grid-headers model=\"model.headersModel\"></rp-grid-headers><rp-grid-filters model=\"model.filtersModel\"></rp-grid-filters><div class=\"rp-grid-body-wrap\"><rp-busy-indicator model=\"model.busyModel\"></rp-busy-indicator><table class=\"rp-grid-body-1 ft-form\" ng-class=\"{init: model.state.busy}\"><tr class=\"rp-grid-row\" ng-repeat=\"record in model.data.records\" ng-class=\"{active: record[model.getSelectKey()]}\"><td ng-switch=\"config.type\" ng-repeat=\"config in model.config\" class=\"rp-grid-cell {{::config.key.decamelize()}} {{::config.classNames}}\"><div ng-switch-when=\"actionsMenu\" class=\"rp-actions-menu\" model=\"config.getActions(record)\"></div><label ng-switch-when=\"select\" class=\"md-check dark-bluebox\"><input type=\"checkbox\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"md-check dark-bluebox\" ng-model=\"record[config.key]\" ng-change=\"model.updateSelected()\" ng-disabled=\"record.disableSelection\" rp-track-selection=\"record[config.key]\" rp-track-selection-id=\"record[config.idKey]\" rp-selection-manager=\"model.selectionManager\"> <i class=\"primary\"></i></label><span ng-switch-when=\"button\" class=\"button {{config.getButtonClassNames(record)}}\" ng-click=\"config.method(record)\">{{config.getButtonText(record)}} </span><a ng-switch-when=\"link\" href=\"{{config.getLink(record)}}\" class=\"rp-grid-text rp-grid-link\">{{record[config.key]}} </a><span ng-switch-when=\"actionLink\" ng-click=\"config.method(record)\" class=\"rp-grid-text rp-grid-link\">{{record[config.key]}} </span><span ng-switch-when=\"date\" class=\"rp-grid-text\">{{record[config.key] | date: config.dateFormat || 'MM/dd/yyyy'}} </span><span ng-switch-when=\"currency\" class=\"rp-grid-text\">{{record[config.key] | currency : config.currencySymbol || '$' : config.decimalLength === undefined ? 2 : config.decimalLength}} </span><span ng-switch-default class=\"rp-grid-text\">{{record[config.key]}}</span></td></tr><tr class=\"rp-grid-empty\" ng-if=\"!model.data.records.length\"><td class=\"empty-msg\">{{model.emptyMsg || 'No results were found.'}}</td></tr></table></div></div><rp-pagination model=\"model.paginationModel\"></rp-pagination></div>");
}]);

