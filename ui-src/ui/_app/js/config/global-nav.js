(function(angular) {
    'use strict';

    function config(prov) {
        var navData = [{
            labelText: 'Overview',
            labelLink: '#/dashbaord',
            iconClassName: 'rp-icon-home'
        }, {
            labelText: 'Invoices',
            labelLink: '#/invoice/lease/0/month/0',
            iconClassName: 'rp-icon-file-document'
        }, {
            labelText: 'Payments',
            labelLink: '#/accounts/lease/0',
            iconClassName: 'rp-icon-card'
        },
         {
            labelText: 'Statements',
            labelLink: '#/statements/lease/:id/month/:m',
            iconClassName: 'rp-icon-card'
        }];
        //, {
        //     labelText: 'Maitenance Request',
        //     labelLink: '/ui/coming-soon/',
        //     iconClassName: 'rp-icon-tools'
        // }, {
        //     labelText: 'Management Staff',
        //     labelLink: '/ui/budgeting/',
        //     iconClassName: 'rp-icon-user-profile'
        // }, {
        //     labelText: 'Documents',
        //     labelLink: '/ui/coming-soon/',
        //     iconClassName: 'rp-icon-file-document'
        // }, {
        //     labelText: 'Contact Us',
        //     labelLink: '/ui/coming-soon/',
        //     iconClassName: 'rp-icon-photo-classic'
        // }];

        prov.setData(navData);
    }
    angular
        .module("ui")
        .run(["rpGlobalNavModel", config]);
})(angular);