(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [{
                    key: "name"
                },
                {
                    key: "title"
                },
                {
                    key: "location"
                },
                {
                    key: "extn"
                },
                {
                    key: "startDate"
                },
                {
                    key: "salary",
                    type: "currency"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "name",
                        text: "Employee Name",
                        isSortable: true
                    },
                    {
                        key: "title",
                        text: "Title"
                    },
                    {
                        key: "location",
                        text: "Location"
                    },
                    {
                        key: "extn",
                        text: "Extn"
                    },
                    {
                        key: "startDate",
                        text: "Start Date"
                    },
                    {
                        key: "salary",
                        text: "Salary"
                    }
                ]
            ];
        };

        model.getGroupHeaders = function() {
            return [
                [{
                        text: ""
                    },
                    {
                        text: "Employee Details-1",
                        colSpan: 2
                    },
                    {
                        text: "Employee Details-2",
                        colSpan: 3
                    }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "name",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by name"
                },
                {
                    key: "title",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by title"
                },
                {
                    key: "location",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by location"
                },
                {
                    key: "extn",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by extn"
                },
                {
                    key: "startDate",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start date"
                },
                {
                    key: "salary",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by salary"
                }
            ];
        };

        return model;
    }

    angular
        .module("uam")
        .factory("sampleGrid1Config", ["rpGridConfig", Factory]);
})(angular);