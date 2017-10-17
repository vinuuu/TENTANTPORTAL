//  Amenities List Manager Model

(function (angular, undefined) {
    "use strict";

    function factory($filter) {
        function AmenitiesListManager() {
            var s = this;
            s.init();
        }

        var p = AmenitiesListManager.prototype;

        p.init = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        // Getters

        p.getList = function () {
            var s = this;
            return s.list;
        };

        p.getSelectedList = function () {
            var s = this;
            return s.selectedList;
        };

        // Setters

        p.setData = function (list) {
            var s = this;
            s.list = list;
            s.updateSelectedList();
            return s;
        };

        // Actions
        p.invertSelectedList = function () {
            var filter,
                newList,
                s = this;
            filter = {
                isSelected: false
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);
            newList.forEach(function (item) {
                s.selectedList.push(item);
            });
            logc(s);
            return s;
        };

        p.updateSelectedList = function () {
            var filter,
                newList,
                s = this;

            filter = {
                isSelected: true
            };

            s.selectedList.flush();
            newList = $filter("filter")(s.list.records, filter);

            newList.forEach(function (item) {
                s.selectedList.push(item);
            });

            return s;
        };        

        p.reset = function () {
            var s = this;
            s.list = [];
            s.selectedList = [];
        };

        return new AmenitiesListManager();
    }

    angular
        .module("uam")
        .factory("AmenitiesListManager", ["$filter", factory]);
})(angular);

