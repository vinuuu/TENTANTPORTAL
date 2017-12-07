(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();

        model.get = function() {
            return [

                {
                    key: "Date"
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
                    type: "custom",
                    templateUrl: "app/templates/labelStatus.html"
                },
                {
                    key: "datePaid"
                },
                {
                    key: "file",
                    type: "custom"
                },
            ];
        };


        model.getHeaders = function() {
            return [
                [

                    {
                        key: "Date",
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
                        key: "datePaid",
                        text: "datePaid"
                    },
                    {
                        key: "file",
                        text: "file"
                    }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "Date",
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
                    placeholder: "Lease ID"
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
                    placeholder: "Filter by STATE"
                },
                {
                    key: "datePaid",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by datePaid"
                }

            ];
        };

        return model;
    }

    angular
        .module("ui")
        .factory("sampleGrid1Config", ["rpGridConfig", Factory]);
})(angular);