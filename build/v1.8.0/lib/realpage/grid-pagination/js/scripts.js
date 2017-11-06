//  Source: _lib\realpage\grid-pagination\js\templates\templates.inc.js
angular.module("rpGrid").run(["$templateCache", function($templateCache) {
$templateCache.put("realpage/grid-pagination/templates/grid-pagination.html",
"<div class=\"rp-grid-pagination\" ng-class=\"{active: model.isActive}\"><div class=\"rp-grid-pagination-inner\"><p class=\"rp-grid-pagination-displaying\">Displaying {{model.rangeStart}}-{{model.rangeEnd}} of {{model.dataCount}}</p><p class=\"rp-grid-pagination-controls prev\"><span ng-class=\"{active: model.allowFirst}\" ng-click=\"gridPagination.goToFirstPage()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-first\"></span> <span ng-class=\"{active: model.allowPrev}\" ng-click=\"gridPagination.goToPrevPageSet()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-prev\"></span></p><ul class=\"rp-grid-pagination-pages\"><li class=\"rp-grid-pagination-page\" ng-repeat=\"page in model.pages\" ng-class=\"{active: page.active}\" ng-click=\"gridPagination.goToPage(page)\">{{page.number + 1}}</li></ul><p class=\"rp-grid-pagination-controls\"><span ng-class=\"{active: model.allowNext}\" ng-click=\"gridPagination.goToNextPageSet()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-next\"></span> <span ng-class=\"{active: model.allowLast}\" ng-click=\"gridPagination.goToLastPage()\" class=\"rp-grid-pagination-control rp-grid-pagination-control-last end\"></span></p></div></div>");
}]);


//  Source: _lib\realpage\grid-pagination\js\directives\grid-pagination.js
//  Grid Pagination Directive

(function (angular) {
    "use strict";

    function rpGridPagination() {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                scope.gridPagination = dir;
            };

            dir.goToPage = function (page) {
                if (!page.active) {
                    model.goToPage(page);
                }
            };

            dir.goToFirstPage = function () {
                model.goToFirstPage();
            };

            dir.goToPrevPageSet = function () {
                model.goToPrevPageSet();
            };

            dir.goToNextPageSet = function () {
                model.goToNextPageSet();
            };

            dir.goToLastPage = function () {
                model.goToLastPage();
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
            templateUrl: "realpage/grid-pagination/templates/grid-pagination.html"
        };
    }

    angular
        .module("rpGrid")
        .directive("rpGridPagination", [rpGridPagination]);
})(angular);

//  Source: _lib\realpage\grid-pagination\js\models\grid-pagination.js
//  Grid Pagination Model

(function (angular, undefined) {
    "use strict";

    function factory($filter, gridPaginationSelection) {
        function GridPagination() {
            var s = this;
            s.init();
        }

        var p = GridPagination.prototype;

        p.init = function () {
            var s = this;

            s.config = {
                currentPage: 0,
                pagesPerGroup: 5,
                recordsPerPage: 2,
                currentPageGroup: 0
            };

            s.data = [];
            s.pages = [];
            s.pageGroups = [];
            s.isActive = false;
            s.allowPrev = false;
            s.allowNext = false;
            s.allowLast = false;
            s.allowFirst = false;
            s.trackingSelection = false;
            s.selectionTracker = gridPaginationSelection();

            return s;
        };

        // Setters

        p.setActivePage = function () {
            var s = this;
            s.pages.forEach(function (item) {
                item.active = item.number === s.config.currentPage;
            });
            return s;
        };

        p.setConfig = function (data) {
            var s = this;
            angular.extend(s.config, data);
            return s;
        };

        p.setControls = function () {
            var s = this;
            s.allowFirst = !(s.config.currentPageGroup === 0 && s.config.currentPage === 0);
            s.allowPrev = s.config.currentPageGroup !== 0;
            s.allowNext = s.config.currentPageGroup != s.pageGroups.length - 1;
            s.allowLast = !(s.config.currentPageGroup === s.pageGroups.length - 1 &&
                s.config.currentPage === s.pages.last().number);
            return s;
        };

        p.setData = function (data) {
            var s = this;

            if (!data || !data.push) {
                logw("GridPagination.setData: Invalid data!", data);
                return s;
            }

            var dataCount = data.length;

            if (s._data === undefined) {
                s._data = [].concat(data);
            }

            s.dataCount = dataCount;
            s.data = [].concat(data);

            s.config.currentPage = 0;
            s.config.currentPageGroup = 0;

            s.setPageGroups(dataCount);
            s.isActive = dataCount !== 0;
            s.totalPages = Math.ceil(dataCount / s.config.recordsPerPage);

            if (s.trackingSelection) {
                s.selectionTracker.genIndex(data);
            }

            return s;
        };

        p.setDataRange = function () {
            var s = this;
            s.rangeStart = s.config.currentPage * s.config.recordsPerPage + 1;
            s.rangeEnd = s.rangeStart + s.config.recordsPerPage - 1;

            if (s.rangeEnd > s.dataCount) {
                s.rangeEnd = s.dataCount;
            }

            return s;
        };

        p.setGrid = function (grid) {
            var s = this;
            s.grid = grid;
            grid.subscribe("sortBy", s.sort.bind(s));
            grid.subscribe("filterBy", s.filter.bind(s));
            grid.subscribe("selectChange", s.recordChanges.bind(s));
            return s;
        };

        p.setGridData = function () {
            var s = this,
                data = s.getDataSlice();

            s.grid.flushData().setData({
                records: data
            });

            return s;
        };

        p.setPageGroup = function () {
            var s = this;
            s.pages = s.pageGroups[s.config.currentPageGroup] || [];
            return s;
        };

        p.setPageGroups = function (dataCount) {
            var s = this,
                setIndex = 0,
                maxPages = s.getMaxPages(),
                setCount = Math.ceil(dataCount / (s.config.pagesPerGroup * s.config.recordsPerPage));

            s.pages = [];
            s.pageGroups = [];

            while (setIndex < setCount) {
                var pageStart = setIndex * s.config.pagesPerGroup,
                    pageEnd = (setIndex + 1) * s.config.pagesPerGroup;

                if (pageEnd > maxPages) {
                    pageEnd = maxPages;
                }

                var pages = [],
                    pageIndex = 0;

                for (var i = pageStart; i < pageEnd; i++) {
                    pages.push({
                        active: false,
                        number: setIndex * s.config.pagesPerGroup + pageIndex++
                    });
                }

                s.pageGroups.push(pages);

                setIndex++;
            }

            s.setPageGroup();

            return s;
        };

        // Getters

        p.getMaxPages = function () {
            var s = this;
            return Math.ceil(s.dataCount / s.config.recordsPerPage);
        };

        p.getSelectionChanges = function () {
            var s = this;
            return s.selectionTracker.getSelectionChanges();
        };

        // Actions

        p.filter = function (filterBy) {
            var s = this,
                data = s.filterData(filterBy);

            s.allowFirst = true;
            s.setData(data);

            if (s.sortBy) {
                s.sort(s.sortBy);
            }

            s.goToFirstPage();
        };

        p.sort = function (sortBy) {
            var s = this,
                data = s.sortData(sortBy);
            s.sortBy = sortBy;
            s.setData(data).setGridData();
        };

        p.sortData = function (sortBy) {
            var s = this,
                key = Object.keys(sortBy)[0],
                reverse = sortBy[key] !== "ASC";

            return $filter("naturalSort")(s.data, key, reverse);
        };

        p.filterData = function (filterBy) {
            var s = this,
                data = s._data,
                newFilterBy = {};

            angular.forEach(filterBy, function (val, key, obj) {
                if (!s.grid.filterExists(key)) {
                    return;
                }

                var filter = s.grid.getFilterByKey(key);

                if (filter.hasCustomFilter()) {
                    data = filter.getCustomFilter()(data, obj);
                }
                else {
                    newFilterBy[key] = val;
                }
            });

            if (Object.keys(newFilterBy).length === 0) {
                return data;
            }

            return $filter("filter")(data, newFilterBy);
        };

        p.getDataSlice = function () {
            var s = this,
                start = s.config.currentPage * s.config.recordsPerPage,
                end = start + s.config.recordsPerPage;

            if (end > s.dataCount) {
                end = s.dataCount;
            }

            return s.data.slice(start, end);
        };

        p.goToFirstPage = function () {
            var s = this;
            if (!s.allowFirst) {
                return;
            }
            s.config.currentPage = 0;
            s.config.currentPageGroup = 0;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToLastPage = function () {
            var s = this;
            if (!s.allowLast) {
                return;
            }
            s.config.currentPageGroup = s.pageGroups.length - 1;
            s.setPageGroup();
            s.config.currentPage = s.pages.last().number;
            s.setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToNextPageSet = function () {
            var s = this;
            if (!s.allowNext) {
                return;
            }

            var maxPage = s.getMaxPages() - 1;
            s.config.currentPageGroup++;
            s.config.currentPage += s.config.pagesPerGroup;

            if (s.config.currentPage > maxPage) {
                s.config.currentPage = maxPage;
            }

            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToPage = function (page) {
            var s = this;
            s.config.currentPage = page.number;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.goToPrevPageSet = function () {
            var s = this;
            if (!s.allowPrev) {
                return;
            }
            s.config.currentPageGroup--;
            s.config.currentPage -= s.config.pagesPerGroup;
            s.setPageGroup().setDataRange().setControls().setActivePage().setGridData();
        };

        p.recordChanges = function () {
            var s = this;
            if (s.trackingSelection) {
                s.selectionTracker.recordChanges(s.grid.getData().records);
            }
            return s;
        };

        p.trackSelection = function (config) {
            var s = this;
            s.trackingSelection = true;
            s.selectionTracker.setConfig(config);
        };

        p.destroy = function () {
            var s = this;

            s.selectionTracker.destroy();

            s.data = undefined;
            s.grid = undefined;
            s.pages = undefined;
            s.config = undefined;
            s.pageGroups = undefined;
            s.selectionTracker = undefined;
        };

        return function () {
            return new GridPagination();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridPaginationModel", [
            "$filter",
            "rpGridPaginationSelectionModel",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\grid-pagination\js\models\grid-pagination-selection.js
//  Grid Pagination Selection Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function GridPaginationSelection() {
            var s = this;
            s.init();
        }

        var p = GridPaginationSelection.prototype;

        p.init = function () {
            var s = this;

            s.states = {};
            s.config = {};

            s.changes = {
                selected: [],
                deselected: []
            };
        };

        // Setters

        p.setConfig = function (config) {
            var s = this;
            s.config = config;
            return s;
        };

        // Getters

        p.getItemID = function (item) {
            var s = this;
            return item[s.config.idKey];
        };

        p.getItemSelState = function (item) {
            var s = this;
            return item[s.config.selectKey];
        };

        p.getSelectionChanges = function () {
            var s = this;

            s.changes = {
                selected: [],
                deselected: []
            };

            Object.keys(s.states).forEach(function (key) {
                var state = s.states[key],
                    changeKey = state.defSelState ? "deselected" : "selected";

                if (state.hasChanged) {
                    s.changes[changeKey].push(state.id);
                }
            });

            return s.changes;
        };

        // Actions

        p.genIndex = function (data) {
            var s = this;

            data.forEach(function (item) {
                s.states["#" + s.getItemID(item)] = {
                    hasChanged: false,
                    id: s.getItemID(item),
                    defSelState: s.getItemSelState(item)
                };
            });

            return s;
        };

        p.recordChanges = function (data) {
            var s = this;

            data.forEach(function (item) {
                var stateData = s.states["#" + s.getItemID(item)];
                stateData.hasChanged = s.getItemSelState(item) !== stateData.defSelState;
            });

            return s;
        };

        p.destroy = function () {
            var s = this;
            s.config = undefined;
            s.states = undefined;
            s.changes = undefined;
        };

        return function () {
            return new GridPaginationSelection();
        };
    }

    angular
        .module("rpGrid")
        .factory("rpGridPaginationSelectionModel", [factory]);
})(angular);

