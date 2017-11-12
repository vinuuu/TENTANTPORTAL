(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();


        model.get = function() {
            return [{
                    key: "Invoice",
                    type: "custom",
                    templateUrl: "home/viewing-paying/templates/textbox.html"
                },
                {
                    key: "Date",
                    type: "select",
                    idKey: "id"
                },
                {
                    key: "Lease ID"
                },
                {
                    key: "Unit ID"
                },
                {
                    key: "Amount"
                },
                {
                    key: "Pay Amount"
                },
                {
                    key: "Status"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "Invoice",
                        text: "Invoice",
                        isSortable: true
                    },
                    {
                        key: "Date",
                        text: "Date"
                    },
                    {
                        key: "Lease ID",
                        text: "Lease ID"
                    },
                    {
                        key: "Unit ID",
                        text: "Unit ID"
                    },
                    {
                        key: "Amount",
                        text: "Amount"
                    },
                    {
                        key: "Pay Amount",
                        text: "Pay Amount"
                    },
                    {
                        key: "Status",
                        text: "Status"
                    }
                ]
            ];
        };


        model.getFilters = function() {
            return [{
                    key: "Invoice",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "Date",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Date"
                },
                {
                    key: "Lease ID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Lease ID"
                },
                {
                    key: "Unit ID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Unit ID"
                },
                {
                    key: "Amount",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by start Amount"
                },
                {
                    key: "Pay Amount",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Pay Amount"
                },
                {
                    key: "Status",
                    type: "textbox",
                    filterDelay: 0,
                    placeholder: "Filter by Status"
                }
            ];
        };

        return model;
    }

    angular
        .module("uam")
        .factory("viewpayGrid1Config", ["rpGridConfig", Factory]);
})(angular);