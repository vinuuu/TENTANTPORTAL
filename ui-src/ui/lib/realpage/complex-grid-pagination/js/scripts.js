//  Source: _lib\realpage\complex-grid-pagination\js\directives\grid-pagination.js
//  Complex Grid Pagination Directive

(function (angular) {
    "use strict";

    function rpCgPagination() {
        function link(scope, elem, attr) {
            var dir = {},
                model = scope.model;

            dir.init = function () {
                scope.gridPagination = dir;
                dir.destWatch = scope.$on("$destroy", dir.destroy);
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

            dir.destroy = function () {
                dir.destWatch();
                dir = undefined;
                attr = undefined;
                elem = undefined;
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
            templateUrl: "realpage/complex-grid-pagination/templates/pagination.html"
        };
    }

    angular
        .module("rpComplexGrid")
        .directive("rpCgPagination", [rpCgPagination]);
})(angular);

//  Source: _lib\realpage\complex-grid-pagination\js\models\grid-data-organizer.js
//  Complex Grid Data Organizer Service

(function (angular) {
    "use strict";

    function CgDataOrganizer(recordModel) {
        var svc = this;

        svc.invalidData = function (data) {
            return !data || !data.records || !data.records.push;
        };

        svc.organizeData = function (data) {
            var record,
                groupCount,
                prevRecord,
                group = [],
                groupsList = [];

            if (svc.invalidData(data)) {
                logc("CgDataOrganizer.organizeData: Data provided is invalid => ", data);
                return groupsList;
            }

            data.records.forEach(function (recordData, index) {
                record = recordModel(recordData);

                if (!prevRecord) {
                    groupCount = 1;
                    group.push(recordData);
                }
                else if (record.isGroupMateOf(prevRecord)) {
                    group.push(recordData);
                }
                else if (groupCount < data.groupsPerPage) {
                    groupCount++;
                    group.push(recordData);
                }
                else {
                    groupsList.push(group);
                    groupCount = 1;
                    group = [recordData];
                }

                prevRecord = record;
            });

            groupsList.push(group);

            return groupsList;
        };
    }

    angular
        .module("rpComplexGrid")
        .service("rpCgDataOrganizer", [
            "rpCgPaginationRecordModel",
            CgDataOrganizer
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid-pagination\js\models\grid-pagination-events.js
//  Complex Grid Pagination Events

(function (angular, undefined) {
    "use strict";

    function factory() {
        return {
            gridReady: "gridReady",
            afterPageChange: "afterPageChange",
            beforePageChange: "beforePageChange"
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgPaginationEvents", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid-pagination\js\models\grid-pagination-record.js
//  Complex Grid Pagination Record Model

(function (angular, undefined) {
    "use strict";

    function factory() {
        function CgPaginationRecord() {
            var s = this;
            s.init();
        }

        var p = CgPaginationRecord.prototype;

        p.init = function () {
            var s = this;
            s.data = {};
        };

        // Setters

        p.setData = function (data) {
            var s = this;
            s.data = data;
            return s;
        };

        // Getters

        p.getID = function () {
            var s = this;
            return s.data.rowID;
        };

        p.getData = function () {
            var s = this;
            return s.data;
        };

        p.getGroupID = function () {
            var s = this;
            return s.data.groupID;
        };

        p.getLevel = function () {
            var s = this;
            return s.data.level;
        };

        // Assertions

        p.hasID = function (id) {
            var s = this;
            return s.data.rowID == id;
        };

        p.is = function (obj) {
            var s = this;
            return obj.getID() == s.getID();
        };

        p.isAggregate = function () {
            var s = this;
            return s.data.rowType == "total" ||
                s.data.rowType == "average";
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

        p.isGroupHeader = function () {
            var s = this;
            return s.data.rowType == "groupHeader";
        };

        p.isGroupMateOf = function (obj) {
            var s = this;
            return s.isChildOf(obj) || s.isDescOf(obj) || s.isSiblingOf(obj);
        };

        p.isSiblingOf = function (obj) {
            var s = this;
            return s.getLevel() == obj.getLevel() &&
                s.getGroupID() == obj.getGroupID();
        };

        // Actions

        p.destroy = function () {
            var s = this;
            s.data = undefined;
        };

        return function (data) {
            return (new CgPaginationRecord()).setData(data);
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgPaginationRecordModel", [factory]);
})(angular);

//  Source: _lib\realpage\complex-grid-pagination\js\models\grid-pagination.js
//  Complex Grid Pagination Model

(function (angular, undefined) {
    "use strict";

    function factory(eventsManager, events) {
        function CgPagination() {
            var s = this;
            s.init();
        }

        var p = CgPagination.prototype;

        p.init = function () {
            var s = this;

            s.config = {
                currentPage: 0,
                pagesPerSet: 2,
                groupsPerPage: 1,
                currentPageSet: 0
            };

            s.pages = [];
            s.dataCount = 0;
            s.pageSets = [];
            s.isActive = false;
            s.allowPrev = false;
            s.allowNext = false;
            s.allowLast = false;
            s.allowFirst = false;
            s.recordsGroups = [];

            s.events = eventsManager().setEvents(Object.keys(events));
        };

        // Setters

        p.setActive = function (bool) {
            var s = this;
            s.isActive = bool === undefined ? true : bool;
            return s;
        };

        p.setActivePage = function () {
            var s = this;

            s.pageSets.forEach(function (pageSet) {
                pageSet.forEach(function (page) {
                    page.active = page.num == s.config.currentPage;
                });
            });

            return s;
        };

        p.setControls = function () {
            var s = this;

            s.allowFirst = s.isActive && !(s.config.currentPageSet === 0 && s.config.currentPage === 0);
            s.allowPrev = s.isActive && s.config.currentPageSet !== 0;
            s.allowNext = s.isActive && s.config.currentPageSet != s.pageSets.length - 1;
            s.allowLast = s.isActive && !(s.config.currentPageSet === s.pageSets.length - 1 &&
                s.config.currentPage === s.pages.last().num);

            return s;
        };

        p.setCurrentPageSet = function () {
            var s = this;
            s.pages = s.pageSets[s.config.currentPageSet] || [];
            return s;
        };

        p.setData = function (data) {
            var s = this;

            if (!data || !data.push) {
                logc("RpCgPaginationModel.setData: Data provided is not an array! => ", data);
                return s;
            }

            s.flushData();
            s.recordsGroups = data;
            s.dataCount = data.length;

            s.setActive(data.length > 0 && data.first().length > 0)
                .setPageSets().setCurrentPageSet()
                .setActivePage().setControls().setGridData().goToFirstPage();

            return s;
        };

        p.setGrid = function (grid) {
            var s = this;
            s.grid = grid;
            return s;
        };

        p.setGridData = function () {
            var s = this,
                gridData = s.recordsGroups[s.config.currentPage] || [];

            s.grid.setData(gridData);
            s.events.publish(events.gridReady);
            return s;
        };

        p.setPageSets = function () {
            var page,
                s = this,
                pageSet = [],
                pageCount = 0;

            for (var i = 0, j = s.recordsGroups.length; i < j; i++) {
                page = {
                    num: i,
                    active: false
                };

                if (pageCount < s.config.pagesPerSet) {
                    pageCount++;
                    pageSet.push(page);
                }
                else {
                    s.pageSets.push(pageSet);
                    pageCount = 1;
                    pageSet = [page];
                }

                if (i == j - 1) {
                    s.pageSets.push(pageSet);
                }
            }

            if (s.recordsGroups.length === 0) {
                s.pageSets.push([]);
            }

            return s;
        };

        // Actions

        p.flushData = function () {
            var s = this;
            s.pages = [];
            s.pageSets = [];
            s.grid.flushData();
            s.recordsGroups = [];
            return s;
        };

        p.goToFirstPage = function () {
            var s = this;

            if (!s.allowFirst) {
                return s;
            }

            s.events.publish(events.beforePageChange);

            s.config.currentPageSet = 0;
            s.pages = s.pageSets[s.config.currentPageSet];
            s.config.currentPage = s.pages.first().num;
            s.setActivePage().setControls().setGridData();

            s.events.publish(events.afterPageChange);

            return s;
        };

        p.goToLastPage = function () {
            var s = this;

            if (!s.allowLast) {
                return s;
            }

            s.events.publish(events.beforePageChange);

            s.config.currentPageSet = s.pageSets.length - 1;
            s.pages = s.pageSets[s.config.currentPageSet];
            s.config.currentPage = s.pages.last().num;
            s.setActivePage().setControls().setGridData();

            s.events.publish(events.afterPageChange);

            return s;
        };

        p.goToNextPageSet = function () {
            var s = this;

            if (!s.allowNext) {
                return s;
            }

            s.events.publish(events.beforePageChange);

            s.config.currentPageSet++;
            s.config.currentPage += s.config.pagesPerSet;

            if (s.config.currentPage > s.recordsGroups.length - 1) {
                s.config.currentPage = s.recordsGroups.length - 1;
            }

            s.pages = s.pageSets[s.config.currentPageSet];
            s.setActivePage().setControls().setGridData();

            s.events.publish(events.afterPageChange);

            return s;
        };

        p.goToPage = function (page) {
            var s = this;

            if (s.config.currentPage == page.num) {
                return s;
            }

            s.events.publish(events.beforePageChange);

            s.config.currentPage = page.num;
            s.setActivePage().setControls().setGridData();

            s.events.publish(events.afterPageChange);

            return s;
        };

        p.goToPrevPageSet = function () {
            var s = this;

            if (!s.allowPrev) {
                return s;
            }

            s.events.publish(events.beforePageChange);

            s.config.currentPageSet--;
            s.config.currentPage -= s.config.pagesPerSet;

            if (s.config.currentPage < 0) {
                s.config.currentPage = 0;
            }

            s.pages = s.pageSets[s.config.currentPageSet];
            s.setActivePage().setControls().setGridData();

            s.events.publish(events.afterPageChange);

            return s;
        };

        p.subscribe = function () {
            var s = this;
            return s.events.subscribe.apply(s.events, arguments);
        };

        p.destroy = function () {
            var s = this;
            s.events.destroy();
            s.recordsGroups.flush();

            s.grid = undefined;
            s.pages = undefined;
            s.events = undefined;
            s.pageSets = undefined;
            s.recordsGroups = undefined;
        };

        return function () {
            return new CgPagination();
        };
    }

    angular
        .module("rpComplexGrid")
        .factory("rpCgPaginationModel", [
            "eventsManager",
            "rpCgPaginationEvents",
            factory
        ]);
})(angular);

//  Source: _lib\realpage\complex-grid-pagination\js\templates\templates.inc.js
angular.module('rpComplexGrid').run(['$templateCache', function ($templateCache) {
$templateCache.put("realpage/complex-grid-pagination/templates/pagination.html",
"<div class=\"rp-cg-pagination\" ng-class=\"{active: model.isActive}\"><div class=\"rp-cg-pagination-inner\"><p class=\"rp-cg-pagination-displaying\">Displaying {{model.config.currentPage + 1}} of {{model.dataCount}}</p><p class=\"rp-cg-pagination-controls prev\"><span ng-class=\"{active: model.allowFirst}\" ng-click=\"gridPagination.goToFirstPage()\" class=\"rp-cg-pagination-control rp-cg-pagination-control-first\"></span> <span ng-class=\"{active: model.allowPrev}\" ng-click=\"gridPagination.goToPrevPageSet()\" class=\"rp-cg-pagination-control rp-cg-pagination-control-prev\"></span></p><ul class=\"rp-cg-pagination-pages\"><li class=\"rp-cg-pagination-page\" ng-repeat=\"page in model.pages\" ng-class=\"{active: page.active}\" ng-click=\"gridPagination.goToPage(page)\">{{page.num + 1}}</li></ul><p class=\"rp-cg-pagination-controls\"><span ng-class=\"{active: model.allowNext}\" ng-click=\"gridPagination.goToNextPageSet()\" class=\"rp-cg-pagination-control rp-cg-pagination-control-next\"></span> <span ng-class=\"{active: model.allowLast}\" ng-click=\"gridPagination.goToLastPage()\" class=\"rp-cg-pagination-control rp-cg-pagination-control-last end\"></span></p></div></div>");
}]);
