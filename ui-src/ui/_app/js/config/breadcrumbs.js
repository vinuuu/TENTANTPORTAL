//  Configure Meta Data

(function(angular) {
    "use strict";

    function config(prov) {
        prov.setProduct({
            name: "commercial"
        });

        prov.setHome({
            icon: "rp-icon-statistics-5",
            text: "Home"
        });

        var links = {
            'home.dashbaord': {
                href: '#/dashbaord',
                text: 'Overview'
            },

            'home.invoice': {},

            'home.statements': {}

        };

        var breadcrumbs = [{
            name: 'home.dashbaord',
            url: '/dashbaord',
            text: "Overview"
        }, {
            name: 'home.invoice',
            url: '/invoice/lease/:id',
            text: 'Invoice'
        }, {
            name: 'home.statements',
            url: '/statements/lease/:id',
            text: 'View Statements'
        }];

        prov.setLinks(links).setBreadcrumbs(breadcrumbs);
    }

    angular
        .module("ui")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);