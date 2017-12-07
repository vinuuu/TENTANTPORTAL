(function(angular) {
    'use strict';

    function config(prov) {
        var navData = [{
            labelText: 'Overview',
            labelLink: '#/dashbaord',
            iconClassName: 'rp-icon-home'
        }, {
            labelText: 'Account & Payments',
            labelLink: '#/accounts',
            iconClassName: 'rp-icon-card'
        }, {
            labelText: 'Invoices',
            labelLink: '#/invoice/lease/:id',
            iconClassName: 'rp-icon-file-document'
        }, {
            labelText: 'Maitenance Request',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-tools'
        }, {
            labelText: 'Management Staff',
            labelLink: '/ui/budgeting/',
            iconClassName: 'rp-icon-user-profile'
        }, {
            labelText: 'Documents',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-file-document'
        }, {
            labelText: 'Contact Us',
            labelLink: '/ui/coming-soon/',
            iconClassName: 'rp-icon-photo-classic'
        }];

        prov.setData(navData);
    }
    angular
        .module("ui")
        .run(["rpGlobalNavModel", config]);
})(angular);