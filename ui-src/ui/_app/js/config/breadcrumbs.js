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
            'home': {
                href: '#/',
                text: 'Overview'
            },

            'home.dashbaord': {},

        };

        var breadcrumbs = [{
            name: 'home',
            url: '/',
            text: "Budgeting"
        }, {
            name: 'home.dashbaord',
            url: '#/dashbaord',
            text: 'Overview'
        }];

        prov.setLinks(links).setBreadcrumbs(breadcrumbs);
    }

    angular
        .module("uam")
        .config(['rpBdgtBreadcrumbsModelProvider', config]);
})(angular);