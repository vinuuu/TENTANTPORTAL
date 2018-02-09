angular.module("rpPagination", []);

//  Source: _lib\realpage\pagination\js\templates\pagination.js
//  Pagination Template

(function (angular) {
    "use strict";

    var templateHtml, templateUrl;

    templateUrl = "templates/realpage/common/pagination/pagination.html";

    templateHtml = "" +
        "<div class='rp-pagination' ng-class='model.state' ng-style='model.style'>" +
        	"<p class='info'>" +
        		"<span>Improve your results by using filters to narrow your search</span>" +
    		"</p>" +

        	"<p class='button-wrap'>" +
	        	"<span class='button btn rounded btn-outline b-primary text-primary' ng-click='model.paginate()'>" +
	        		"{{model.btnText}}" +
	        	"</span>" +
        	"</p>" +

        	"<p class='showing'>" +
        		"Showing {{model.current}} of {{model.max}} results" +
    		"</p>" +

        	"<p class='loading'>Loading more results...</p>" +
        "</div>";

    function installTemplate($templateCache) {
        $templateCache.put(templateUrl, templateHtml);
    }

    angular
        .module("rpPagination")
        .run(['$templateCache', installTemplate]);
})(angular);

//  Source: _lib\realpage\pagination\js\models\pagination.js
//  Pagination Model

(function(angular) {
    "use strict";

    function factory($window, eventStream) {
        return function() {
            var model = {};

            model.events = {
                update: eventStream()
            };

            model.data = {
                sortBy: {},

                filterBy: {},

                pages: {
                    startRow: 0,
                    resultsPerPage: 100
                }
            };

            model.state = {
                busy: false,
                enabled: false,
                suggestion: false
            };

            model.init = function() {
                model.max = 0;
                model.style = {};
                model.current = 0;
                model.btnText = 'Show More';
                return model;
            };

            model.setEvents = function(events) {
                model.events = events;
                return model;
            };

            model.setSortBy = function(sortBy) {
                model.data.sortBy = sortBy;
                return model;
            };

            model.setFilterBy = function(filterBy) {
                model.data.filterBy = filterBy;
                return model;
            };

            model.setFilterValue = function(key, value) {
                model.data.filterBy[key] = value;
                return model;
            };

            model.clearSortValue = function() {
                model.data.sortBy = {};
            };

            model.setSortValue = function(key, value) {
                model.data.sortBy[key] = value;
                return model;
            };

            model.setPages = function(pages) {
                model.data.pages = pages;
                return model;
            };

            model.extendSortBy = function(sortBy) {
                angular.extend(model.data.sortBy, sortBy);
                return model;
            };

            model.extendFilterBy = function(filterBy) {
                angular.extend(model.data.filterBy, filterBy);
                return model;
            };

            model.extendPages = function(pages) {
                angular.extend(model.data.pages, pages);
                return model;
            };

            model.paginate = function() {
                model.state.busy = true;
                model.data.pages.startRow += model.data.pages.resultsPerPage;
                model.events.update.publish(model.data);
            };

            model.updateState = function(max) {
                var current,
                    state = model.state;
                model.max = max;
                state.busy = false;
                current = model.current + model.data.pages.resultsPerPage;
                model.current = current > max ? max : current;
                state.enabled = model.current < max;
                state.suggestion = model.current > 400;
            };

            model.reset = function() {
                model.max = 0;
                model.current = 0;
                model.data.pages.startRow = 0;
                model.state.enabled = false;
                return model;
            };

            model.getCurrent = function() {
                return model.current;
            };

            model.setCurrent = function(current) {
                model.current = current;
                return model;
            };

            model.getQuery = function() {
                var str = $window.JSON.stringify(model.data);
                return '?datafilter=' + $window.btoa(str);
            };

            model.setResultsPerPage = function(count) {
                model.data.pages.resultsPerPage = count;
                return model;
            };

            model.destroy = function() {
                model.events.update.destroy();
                model = undefined;
            };

            return model.init();
        };
    }

    angular
        .module("rpPagination")
        .factory('rpPaginationModel', ['$window', 'eventStream', factory]);
})(angular);

//  Source: _lib\realpage\pagination\js\directives\pagination.js
//  Pagination Directive

(function (angular) {
    "use strict";

    function rpPagination() {
        function link(scope, elem, attr) {}

        return {
            scope: {
            	model: '='
            },
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: "templates/realpage/common/pagination/pagination.html"
        };
    }

    angular
        .module("rpPagination")
        .directive('rpPagination', [rpPagination]);
})(angular);
