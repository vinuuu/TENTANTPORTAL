(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [{
                    key: "Date"
                },
                {
                    key: "Transactions"
                },
                {
                    key: "Details"
                },
                {
                    key: "Amount"
                },
                {
                    key: "Payments"
                },
                {
                    key: "Balance"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "Date",
                        text: "Date",
                        isSortable: true
                    },
                    {
                        key: "Transactions",
                        text: "Transactions"
                    },
                    {
                        key: "Details",
                        text: "Details"
                    },
                    {
                        key: "Amount",
                        text: "Amount"
                    },
                    {
                        key: "Payments",
                        text: "Payments"
                    },
                    {
                        key: "Balance",
                        text: "Balance"
                    }
                ]
            ];
        };

        // model.getGroupHeaders = function() {
        //     return [
        //         [{
        //                 text: ""
        //             },
        //             {
        //                 text: "Employee Details-1",
        //                 colSpan: 2
        //             },
        //             {
        //                 text: "Employee Details-2",
        //                 colSpan: 3
        //             }
        //         ]
        //     ];
        // };

        model.getFilters = function() {
            return [{
                    key: "Date",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "Transactions",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Transactions"
                },
                {
                    key: "Details",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Details"
                },
                {
                    key: "Amount",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "Payments",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Payments"
                },
                {
                    key: "Balance",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Balance"
                }
            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("staementGrid1Config", ["rpGridConfig", Factory]);
})(angular);