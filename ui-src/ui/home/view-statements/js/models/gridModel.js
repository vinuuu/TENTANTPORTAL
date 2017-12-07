(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [{
                    key: "WHENCREATED"
                },
                {
                    key: "TYPE"
                },
                {
                    key: "DESCRIPTION"
                },
                {
                    key: "AMOUNT"
                },
                {
                    key: "PAYMENT"
                },
                {
                    key: "BALANCE"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "WHENCREATED",
                        text: "Date",
                        isSortable: true
                    },
                    {
                        key: "TYPE",
                        text: "Transactions"
                    },
                    {
                        key: "DESCRIPTION",
                        text: "Details"
                    },
                    {
                        key: "AMOUNT",
                        text: "Amount"
                    },
                    {
                        key: "PAYMENT",
                        text: "Payments"
                    },
                    {
                        key: "BALANCE",
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
                    key: "WHENCREATED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "TYPE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Transactions"
                },
                {
                    key: "DESCRIPTION",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Details"
                },
                {
                    key: "AMOUNT",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "PAYMENT",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Payments"
                },
                {
                    key: "BALANCE",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Balance"
                }
            ];
        };
        model.getTrackSelectionConfig = function() {
            var config = {},
                columns = model.get();

            columns.forEach(function(column) {
                if (column.type == "select") {
                    config.idKey = column.idKey;
                    config.selectKey = column.key;
                }
            });

            return config;
        };
        return model;
    }

    angular
        .module("ui")
        .factory("staementGrid1Config", ["rpGridConfig", Factory]);
})(angular);