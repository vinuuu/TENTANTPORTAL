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
                    key: "RECORDID",

                },
                {
                    key: "WHENCREATED"
                },
                {
                    key: "LEASEID"

                },
                {
                    key: "UNITID"
                },
                {
                    key: "ACCOUNTLABEL"
                },
                {
                    key: "TOTALENTERED",
                    type: "custom",
                    templateUrl: "app/templates/currency.html",
                },
                {
                    key: "TOTALDUE",
                    type: "custom",
                    templateUrl: "app/templates/currency.html",
                },
                {
                    key: "TOTALPAYING",
                    type: "custom",
                    templateUrl: "app/templates/textbox.html",
                    onPayAmount: model.getMethod('onPayAmount'),
                },
                {
                    key: "STATE",
                    type: "custom",
                    templateUrl: "app/templates/label.html"
                }
            ];
        };


        model.getHeaders = function() {
            return [
                [{
                        key: "isSelect",
                        type: "select",
                        enabled: true
                    },
                    {
                        key: "RECORDID",
                        text: "Invoice number"
                    },
                    {
                        key: "WHENCREATED",
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
                        key: "ACCOUNTLABEL",
                        text: "Account label"
                    },                    
                    {
                        key: "TOTALENTERED",
                        text: "Amount"
                    },
                    {
                        key: "TOTALDUE",
                        text: "Amount due"
                    },
                    {
                        key: "TOTALPAYING",
                        text: "Pay amount"
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
                    key: "RECORDID",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Invoice"
                },
                {
                    key: "WHENCREATED",
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
                    key: "TOTALDUE",
                    type: "text",
                    filterDelay: 0,
                    placeholder: "Filter by Amount Due"
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