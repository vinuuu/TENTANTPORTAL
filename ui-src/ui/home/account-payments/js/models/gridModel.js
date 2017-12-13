(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [

                {
                    key: "WHENCREATED"
                },
                {
                    key: "RECORDNO",
                },
                {
                    key: "LEASEID"

                },
                {
                    key: "UNITID"
                },
                {
                    key: "TOTALENTERED",
                    type: "currency"
                },
                {
                    key: "STATE",
                },
                {
                    key: "WHENPAID"
                },
                // {
                //     key: "file",
                //     type: "custom",
                //     templateUrl: "app/templates/fileSymbols.html"
                // },
            ];
        };


        model.getHeaders = function() {
            return [
                [

                    {
                        key: "WHENCREATED",
                        text: "Date"
                    },
                    {
                        key: "RECORDNO",
                        text: "Invoice"
                    },
                    {
                        key: "LEASEID",
                        text: "Lease ID"
                    },
                    {
                        key: "UNITID",
                        text: "Unit ID"
                    },
                    {
                        key: "TOTALENTERED",
                        text: "Amount"
                    },
                    {
                        key: "STATE",
                        text: "Status"
                    },
                    {
                        key: "WHENPAID",
                        text: "DatePaid"
                    }
                    // {
                    //     key: "file",
                    //     text: "file"
                    // }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "WHENCREATED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "RECORDNO",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "LEASEID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Lease ID"
                },
                {
                    key: "UNITID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Unit ID"
                },
                {
                    key: "TOTALENTERED",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount"
                },
                {
                    key: "STATE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Status"
                },
                {
                    key: "WHENPAID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by DatePaid"
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
        .factory("sampleGrid1Config", ["rpGridConfig", Factory]);
})(angular);