//  Configure Meta Data

(function(angular) {
    "use strict";

    function config(prov) {
        prov.setProduct({
            name: "commercial"
        });

        prov.setHome({
            icon: "rp-icon-home",
            text: "Home"
        });

        var links = {
            'home.dashbaord': {
                href: '#/dashbaord',
                text: 'Overview'
            },

            'home.invoice': {},

            'home.statements': {},

            'home.account-payments': {}


        };

        var breadcrumbs = [{
            name: 'home.dashbaord',
            url: '/dashbaord',
            text: "Overview"
        }, {
            name: 'home.invoice',
            url: '/invoice/lease/:id/month/:0',
            text: 'Invoices'
        }, {
            name: 'home.statements',
            url: '/statements/lease/:id/month/:m',
            text: 'Statements',
            // backLink: 'home.dashbaord',
            // links: ['home.dashbaord', 'home.account-payments']
        }, {
            name: 'home.account-payments',
            url: '/accounts/lease/:id',
            text: 'Payments'
        }];

        prov.setLinks(links).setBreadcrumbs(breadcrumbs);
    }

    angular
        .module("ui")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);