//  Configure Meta Data

(function(angular) {
    "use strict";

    function config(prov) {
        prov.setProduct({
            name: "commercial"
        });

        prov.setHome({
            icon: "rp-icon-statistics-5",
            text: "PMC NAME"
        });

        var links = {
            'home.dashbaord': {
                href: '#/dashbaord',
                text: 'Overview'
            },

            'home.invoice': {
                href: '#/invoice',
                text: 'Invoice'
            },

        };

        var breadcrumbs = [{
            name: 'home.dashbaord',
            url: '/dashbaord',
            text: "Overview"
        }, {
            name: 'home.invoice',
            url: '/invoice',
            text: 'Invoice'
        }];

        prov.setLinks(links).setBreadcrumbs(breadcrumbs);
    }

    angular
        .module("ui")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);