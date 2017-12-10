(function(angular) {
    "use strict";

    function Factory(gridConfig) {
        var model = gridConfig();


        model.get = function() {
            return [{
                    key: "isSelect",
                    type: "select",
                    idKey: "id"
                },
                {
                    key: "RECORDNO",

                },
                {
                    key: "Date"
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
                    key: "TOTALPAYING",
                    type: "custom",
                    templateUrl: "app/templates/textbox.html"
                },
                {
                    key: "STATE",
                    type: "custom",
                    // templateUrl: 'home/invoice/templates/labelStatus.html'
                    templateUrl: "app/templates/label.html"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "isSelect",
                        type: "select",
                        enabled: false
                    },
                    {
                        key: "RECORDNO",
                        text: "Invoice"
                    },
                    {
                        key: "Date",
                        text: "Date"
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
                        key: "TOTALPAYING",
                        text: "Pay Amount"
                    },
                    {
                        key: "STATE",
                        text: "Status"
                    }
                ]
            ];
        };

        model.getFilters = function() {
            return [{
                    key: "isSelect",
                    value: "",
                    type: "menu",
                    options: [{
                            value: "",
                            name: "All"
                        },
                        {
                            value: true,
                            name: "Selected"
                        },
                        {
                            value: false,
                            name: "Not Selected"
                        }
                    ]
                }, {
                    key: "RECORDNO",
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
                    key: "TOTALPAYING",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Pay Amount"
                },
                {
                    key: "STATE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by STATE"
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
        .factory("invoiceGrid1Config", ["rpGridConfig", Factory]);
})(angular);